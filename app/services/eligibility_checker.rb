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

    llm = RubyLLM.chat(model: "claude-3-sonnet-20240229")

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
    <<~PROMPT
      You are an EU funding eligibility expert. Analyze if this Romanian company is eligible for the funding program.

      COMPANY DATA:
      #{format_company_data}

      PROGRAM REQUIREMENTS:
      Title: #{@program.title}
      Description: #{@program.description}
      Eligibility Rules: #{@program.eligibility_rules}

      INSTRUCTIONS:
      1. Analyze the company data against the program requirements
      2. Reply with exactly "ELIGIBLE" or "NOT_ELIGIBLE" as the first word
      3. Follow with a brief explanation (2-3 sentences)

      Example format:
      ELIGIBLE: The company meets all requirements because...
      OR
      NOT_ELIGIBLE: The company does not qualify because...
    PROMPT
  end

  def format_company_data
    data = @company.api_response
    <<~DATA
      - Company Name: #{data['Name']}
      - CUI: #{data['TaxCode']}
      - Status: #{data['Status']}
      - Legal Form: #{data['LegalForm']}
      - NACE Code: #{data['NACE']}
      - Employees: #{data['Employees']}
      - Turnover: #{data['Turnover']}
      - Location: #{data['County']}, #{data['City']}
    DATA
  end

  def parse_response(response)
    eligible = response.to_s.upcase.start_with?("ELIGIBLE")

    {
      eligible: eligible,
      reason: response.to_s
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

    {
      eligible: eligible,
      reason: eligible ?
        "ELIGIBLE: Company appears to meet SME criteria with #{employees} employees." :
        "NOT_ELIGIBLE: Company has #{employees} employees, outside SME range (10-250)."
    }
  end
end
