class Admin::FundingProgramsController < ApplicationController
  before_action :authenticate_admin
  before_action :set_funding_program, only: [ :show, :edit, :update, :destroy ]

  # Allow CSRF for proper authentication

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
      llm = RubyLLM.chat(model: "claude-3-5-sonnet")

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
      Ultrathink: You are an expert EU funding program analyst. I need you to carefully analyze the following EU funding program documentation and extract eligibility rules into two distinct categories.

      CRITICAL INSTRUCTIONS:
      1. Extract ONLY explicit eligibility requirements mentioned in the text
      2. Categorize them into:
         - COMPANY RULES: Requirements that can be verified from company API data (size, age, legal status, location, financial metrics, employees, NACE codes, etc.)
         - PROJECT RULES: Requirements that need project-specific information or manual review (innovation type, project timeline, research focus, etc.)

      3. Format each rule as a bullet point starting with "-"
      4. Be specific and precise - don't add requirements not explicitly mentioned
      5. Use clear, actionable language

      FUNDING PROGRAM CONTENT:
      #{content}

      Please respond in this exact format:

      COMPANY_RULES:
      [List company-related requirements here]

      PROJECT_RULES:
      [List project-related requirements here]

      If no rules are found in a category, write "- No specific requirements mentioned"
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
    # Simple HTTP basic authentication for MVP
    authenticate_or_request_with_http_basic do |username, password|
      username == "admin" && password == (Rails.application.credentials.admin_password || "admin123")
    end
  end
end
