class ChatService
  def self.ask(program, company, message)
    new(program, company).ask(message)
  end

  def initialize(program, company)
    @program = program
    @company = company
  end

  def ask(message)
    return mock_response(message) if Rails.env.development? && anthropic_key_missing?

    llm = RubyLLM.chat(model: "claude-3-sonnet-20240229")

    # Build context for the conversation
    context = build_context
    full_prompt = "#{context}\n\nUser Question: #{message}"

    response = llm.ask(full_prompt)
    response.to_s
  rescue => e
    "I'm sorry, I encountered an error while processing your question: #{e.message}"
  end

  private

  def build_context
    <<~CONTEXT
      You are an expert EU funding consultant specializing in Romanian companies and European funding programs.

      PROGRAM CONTEXT:
      Program: #{@program.title}
      Description: #{@program.description}
      Detailed Guide: #{@program.pdf_content.present? ? @program.pdf_content[0..2000] : 'No detailed guide available'}

      COMPANY CONTEXT:
      #{format_company_context}

      Your role is to:
      1. Provide expert advice on EU funding applications
      2. Help assess project feasibility and risks
      3. Suggest strategies for successful applications
      4. Answer questions about eligibility criteria and requirements
      5. Guide on application processes and documentation

      Always provide specific, actionable advice based on the program requirements and company profile.
    CONTEXT
  end

  def format_company_context
    data = @company.api_response
    <<~COMPANY
      Company: #{data['Name']} (CUI: #{data['TaxCode']})
      Legal Form: #{data['LegalForm']}
      Activity: NACE #{data['NACE']}
      Size: #{data['Employees']} employees
      Financial: #{data['Turnover']} lei turnover, #{data['Profit']} lei profit
      Location: #{data['City']}, #{data['County']}
      Status: #{data['Status']} (#{data['FiscalActivity']})
    COMPANY
  end

  def anthropic_key_missing?
    Rails.application.credentials.anthropic_api_key.blank? && ENV["ANTHROPIC_API_KEY"].blank?
  end

  def mock_response(message)
    case message.downcase
    when /feasibility|viable|chance/
      "Based on your company profile (#{@company.company_name}), the #{@program.title} program could be a good fit. Your company size and sector alignment suggest reasonable chances of success. I recommend focusing on innovation aspects and market potential in your application."
    when /risk|challenge/
      "Main risks for your application include: 1) Strong competition from similar companies, 2) Need for detailed financial projections, 3) Compliance with state aid regulations. Mitigation strategies include thorough market research and partnering with research institutions."
    when /document|requirement/
      "For #{@program.title}, you'll typically need: Business plan, financial statements (last 2-3 years), project description with timeline, market analysis, and impact assessment. Make sure all documents are recent and certified."
    else
      "Thank you for your question about #{@program.title}. As an EU funding expert, I can help you analyze your company's fit for this program and guide you through the application process. Could you be more specific about what aspect you'd like to explore?"
    end
  end
end
