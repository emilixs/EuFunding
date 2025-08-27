class EligibilityChecker
  def self.check(company, program)
    new(company, program).check_eligibility
  end

  def initialize(company, program)
    @company = company
    @program = program
  end

  def check_eligibility
    return mock_response if Rails.env.development? && anthropic_key_missing?

    llm = RubyLLM.chat(model: "claude-3-5-sonnet-20241022")

    prompt = build_prompt
    response = llm.ask(prompt)

    parse_response(response)
  rescue => e
    {
      eligible: false,
      reason: "Error checking eligibility: #{e.message}"
    }
  end

  private

  def build_prompt
    company_rules = @program.company_eligibility_rules.presence || @program.eligibility_rules

    <<~PROMPT
      Ești un expert în finanțări europene pentru companii românești. Analizează această companie română în raport cu FIECARE criteriu specific de eligibilitate.

      DATELE COMPANIEI:
      #{format_company_data}

      PROGRAMUL: #{@program.title}

      CRITERIILE DE ELIGIBILITATE DE VERIFICAT:
      #{company_rules}

      INSTRUCȚIUNI IMPORTANTE:
      1. Verifică FIECARE criteriu individual în raport cu datele companiei
      2. Pentru fiecare criteriu, clasifică-l ca fiind:
         - ACCEPTATE: Compania îndeplinește clar această cerință
         - REFUZATE: Compania NU îndeplinește clar această cerință
         - NEVALIDATE: Nu se poate determina din datele disponibile ale companiei

      3. Răspunde EXCLUSIV în limba română, folosind EXACT acest format:

      ACCEPTATE:
      - [Criteriul specific]: [Explicație detaliată în română cu date concrete ale companiei care susțin decizia]

      REFUZATE:
      - [Criteriul specific]: [Explicație detaliată în română cu date concrete ale companiei care justifică refuzul]

      NEVALIDATE:
      - [Criteriul specific]: [Explicație detaliată în română despre ce informații lipsesc pentru validare]

      DECIZIA FINALĂ:
      - Dacă TOATE criteriile sunt ACCEPTATE: Compania este ELIGIBILĂ
      - Dacă ORICARE criteriu este REFUZAT: Compania NU este ELIGIBILĂ
      - Dacă unele sunt ACCEPTATE și altele NEVALIDATE (fără REFUZATE): Compania este ELIGIBILĂ

      REZULTAT: ELIGIBILĂ/NU_ESTE_ELIGIBILĂ

      IMPORTANT: Întregul răspuns trebuie să fie în limba română, cu explicații detaliate pentru fiecare criteriu.
    PROMPT
  end

  def format_company_data
    data = @company.api_response
    <<~DATA
      - Denumirea companiei: #{data['Name']}
      - CUI: #{data['TaxCode']}
      - Statut: #{data['Status']}
      - Forma juridică: #{data['LegalForm']}
      - Codul NACE: #{data['NACE']}
      - Numărul de angajați: #{data['Employees']}
      - Cifra de afaceri: #{data['Turnover']} lei
      - Profitul: #{data['Profit']} lei
      - Locația: #{data['County']}, #{data['City']}
      - Data înregistrării: #{data['Date']}
      - Activitatea fiscală: #{data['FiscalActivity']}
    DATA
  end

  def parse_response(response)
    # Extract text from RubyLLM::Message object properly
    response_text = if response.respond_to?(:content)
                      response.content
    elsif response.respond_to?(:text)
                      response.text
    else
                      response.to_s
    end

    # Extract the final result (support both Romanian and English)
    if response_text.match(/REZULTAT:\s*(ELIGIBILĂ|NU_ESTE_ELIGIBILĂ)/i)
      eligible = $1.upcase == "ELIGIBILĂ"
    elsif response_text.match(/RESULT:\s*(ELIGIBLE|NOT_ELIGIBLE)/i)
      eligible = $1.upcase == "ELIGIBLE"
    else
      # Fallback parsing method
      eligible = (response_text.upcase.include?("ELIGIBILĂ") || response_text.upcase.include?("ELIGIBLE")) &&
                 !response_text.upcase.include?("NU_ESTE_ELIGIBILĂ") &&
                 !response_text.upcase.include?("NOT_ELIGIBLE")
    end

    {
      eligible: eligible,
      reason: response_text
    }
  end

  def anthropic_key_missing?
    Rails.application.credentials.anthropic_api_key.blank? && ENV["ANTHROPIC_API_KEY"].blank?
  end

  # Mock response for development
  def mock_response
    # Simple mock logic based on company size
    employees = @company.api_response["Employees"].to_i
    eligible = employees >= 10 && employees <= 250  # SME criteria

    if eligible
      reason = <<~REASON
        ACCEPTATE:
        - Criteriul IMM (Întreprindere Mică și Mijlocie): Compania are #{employees} angajați, ceea ce se încadrează în limitele pentru IMM (10-250 angajați)
        - Statut activ: Compania are statutul "#{@company.api_response['Status']}" care permite participarea la programe de finanțare

        NEVALIDATE:
        - Cifra de afaceri eligibilă: Nu se poate determina dacă cifra de afaceri respectă limitele programului din datele disponibile
        - Domeniul de activitate: Necesită verificare suplimentară pentru compatibilitatea cu obiectivele programului

        REZULTAT: ELIGIBILĂ
      REASON
    else
      reason = <<~REASON
        REFUZATE:
        - Criteriul IMM (Întreprindere Mică și Mijlocie): Compania are #{employees} angajați, ceea ce depășește/nu atinge limitele pentru IMM (10-250 angajați)

        REZULTAT: NU_ESTE_ELIGIBILĂ
      REASON
    end

    {
      eligible: eligible,
      reason: reason.strip
    }
  end
end
