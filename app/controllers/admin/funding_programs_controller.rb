class Admin::FundingProgramsController < ApplicationController
  before_action :authenticate_admin
  before_action :set_funding_program, only: [ :show, :edit, :update, :destroy ]

  def index
    @funding_programs = FundingProgram.all.order(:title)
  end

  def show
  end

  def new
    @funding_program = FundingProgram.new
  end

  def create
    @funding_program = FundingProgram.new(funding_program_params)

    if @funding_program.save
      flash[:success] = "Funding program created successfully"
      redirect_to admin_funding_program_path(@funding_program)
    else
      flash.now[:error] = "Please fix the errors below"
      render :new
    end
  end

  def edit
  end

  def update
    if @funding_program.update(funding_program_params)
      flash[:success] = "Funding program updated successfully"
      redirect_to admin_funding_program_path(@funding_program)
    else
      flash.now[:error] = "Please fix the errors below"
      render :edit
    end
  end

  def destroy
    @funding_program.destroy
    flash[:success] = "Funding program deleted successfully"
    redirect_to admin_funding_programs_path
  end

  def extract_eligibility_rules
    content = params[:content]

    if content.blank?
      render json: { error: "No content provided" }, status: 400
      return
    end

    begin
      # Use RubyLLM to extract eligibility rules with ultrathink
      llm = RubyLLM.chat(model: "claude-3-5-sonnet-20241022")

      prompt = build_extraction_prompt(content)
      response = llm.ask(prompt)

      # Extract text from RubyLLM::Message object
      response_text = response.respond_to?(:content) ? response.content : response.to_s
      Rails.logger.info "[Admin] Claude response: #{response_text}"

      # Parse the structured response
      parsed_rules = parse_eligibility_response(response_text)

      render json: {
        company_rules: parsed_rules[:company_rules],
        project_rules: parsed_rules[:project_rules]
      }

    rescue => e
      Rails.logger.error "[Admin] Error extracting eligibility rules: #{e.message}"
      render json: { error: "Failed to extract rules: #{e.message}" }, status: 500
    end
  end

  private

  def set_funding_program
    @funding_program = FundingProgram.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    flash[:error] = "Funding program not found"
    redirect_to admin_funding_programs_path
  end

  def funding_program_params
    params.require(:funding_program).permit(:title, :description, :pdf_content, :eligibility_rules, :company_eligibility_rules, :project_eligibility_rules, :active)
  end

  def build_extraction_prompt(content)
    <<~PROMPT
      Ultrathink: Ești un expert analist în programe de finanțare europeană. Trebuie să analizezi cu atenție următoarea documentație de program de finanțare UE și să extragi criteriile de eligibilitate în două categorii distincte.

      INSTRUCȚIUNI CRITICE:
      1. Extrage DOAR cerințele de eligibilitate explicite menționate în text
      2. Categorizează-le în:
         - COMPANY RULES: Cerințe care pot fi verificate din datele API ale companiei (mărime, vechime, statut juridic, locație, indicatori financiari, angajați, coduri NACE, etc.)
         - PROJECT RULES: Cerințe care necesită informații specifice proiectului sau revizuire manuală (tipul de inovație, cronologia proiectului, focusul cercetării, etc.)

      3. Formatează fiecare regulă ca punct cu bullet începând cu "-"
      4. Fii specific și precis - nu adăuga cerințe care nu sunt menționate explicit
      5. Folosește un limbaj clar și acționabil
      6. TOATE REGULILE TREBUIE SĂ FIE SCRISE ÎN LIMBA ROMÂNĂ

      FOCUS SPECIAL PENTRU COMPANY RULES - Fă-le CONCRETE și VERIFICABILE:
      - Transformă referințele juridice vagi în criterii specifice, verificabile
      - În loc de "Trebuie să fie o companie înființată conform Legii 31/1990" scrie "Trebuie să fie o societate cu răspundere limitată (SRL) sau societate pe acțiuni (SA)"
      - În loc de "criterii IMM" scrie "Trebuie să aibă între 10-250 angajați ȘI cifra de afaceri anuală sub 50 milioane €"
      - Include praguri numerice specifice, coduri NACE, forme juridice, locații geografice
      - Folosește criterii măsurabile care pot fi verificate automat din câmpurile bazei de date a companiei
      - Pentru cerințe de vechime, specifică anii exacți: "Trebuie să fie operațională minimum 2 ani de la data înregistrării"
      - Pentru locație, fii specific: "Trebuie să fie înregistrată în statele membre UE" sau "Trebuie să fie localizată în România"
      - Pentru criterii financiare, include sume exacte și moneda

      EXEMPLE DE COMPANY RULES CONCRETE BUNE (ÎN ROMÂNĂ):
      - Trebuie să aibă între 10-250 angajați (definiția IMM)
      - Cifra de afaceri anuală trebuie să fie sub 50 milioane €
      - Trebuie să fie operațională minimum 2 ani de la data înregistrării
      - Trebuie să fie o societate cu răspundere limitată (SRL) sau societate pe acțiuni (SA)
      - Trebuie să aibă statut activ de conformitate fiscală
      - Trebuie să fie înregistrată în România sau alte state membre UE
      - Trebuie să aibă cod NACE în sectorul manufacturier (codurile 10-33)
      - Trebuie să aibă venituri anuale minime de 100.000 €

      CONȚINUTUL PROGRAMULUI DE FINANȚARE:
      #{content}

      Te rog să răspunzi în acest format exact (ÎN ROMÂNĂ):

      COMPANY_RULES:
      [Listează aici cerințele legate de companie - fă-le concrete și verificabile, ÎN ROMÂNĂ]

      PROJECT_RULES:
      [Listează aici cerințele legate de proiect, ÎN ROMÂNĂ]

      Dacă nu se găsesc reguli într-o categorie, scrie "- Nu sunt menționate cerințe specifice"
    PROMPT
  end

  def parse_eligibility_response(response_text)
    # Extract only the rules, ignoring explanatory text
    lines = response_text.lines.map(&:strip)

    company_rules = []
    project_rules = []
    current_section = nil

    lines.each do |line|
      if line.match(/COMPANY_RULES:/i)
        current_section = :company
      elsif line.match(/PROJECT_RULES:/i)
        current_section = :project
      elsif line.start_with?("-") && current_section
        # Only extract bullet points, ignore explanatory paragraphs
        case current_section
        when :company
          company_rules << line
        when :project
          project_rules << line
        end
      end
    end

    {
      company_rules: company_rules.join("\n"),
      project_rules: project_rules.join("\n")
    }
  end

  def authenticate_admin
    # Session-based authentication - redirect to login if not authenticated
    unless session[:admin_authenticated]
      redirect_to admin_login_path
    end
  end
end
