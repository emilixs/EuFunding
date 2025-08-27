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
      You are an EU funding eligibility expert. Analyze this Romanian company against EACH specific eligibility rule.

      COMPANY DATA:
      #{format_company_data}

      PROGRAM: #{@program.title}

      COMPANY ELIGIBILITY RULES TO CHECK:
      #{company_rules}

      INSTRUCTIONS:
      1. Check EACH rule individually against the company data
      2. For each rule, classify it as one of:
         - ACCEPTATE: Company clearly meets this requirement
         - REFUZATE: Company clearly does NOT meet this requirement
         - NEVALIDATE: Cannot determine from available company data (missing information)

      3. Respond in this EXACT format:

      RULE ANALYSIS:
      - [Rule text]: ACCEPTATE/REFUZATE/NEVALIDATE - [Brief explanation]
      - [Rule text]: ACCEPTATE/REFUZATE/NEVALIDATE - [Brief explanation]

      FINAL DECISION:
      - If ALL rules are ACCEPTATE: Company is ELIGIBLE
      - If ANY rule is REFUZATE: Company is NOT_ELIGIBLE
      - If some ACCEPTATE and some NEVALIDATE (no REFUZATE): Company is ELIGIBLE

      RESULT: ELIGIBLE/NOT_ELIGIBLE
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
    # Extract text from RubyLLM::Message object properly
    response_text = if response.respond_to?(:content)
                      response.content
                    elsif response.respond_to?(:text)
                      response.text
                    else
                      response.to_s
                    end

    # Extract the final result
    if response_text.match(/RESULT:\s*(ELIGIBLE|NOT_ELIGIBLE)/i)
      eligible = $1.upcase == "ELIGIBLE"
    else
      # Fallback to old parsing method
      eligible = response_text.upcase.include?("ELIGIBLE") && !response_text.upcase.include?("NOT_ELIGIBLE")
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

    {
      eligible: eligible,
      reason: eligible ?
        "ELIGIBLE: Company appears to meet SME criteria with #{employees} employees." :
        "NOT_ELIGIBLE: Company has #{employees} employees, outside SME range (10-250)."
    }
  end
end
