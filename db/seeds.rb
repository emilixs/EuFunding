# EU Funding Programs seed data

puts "Creating sample funding programs..."

FundingProgram.find_or_create_by!(title: "SME Innovation Support") do |program|
  program.description = "Support for small and medium enterprises to develop innovative products and services. Focus on digitalization, green technology, and export capabilities."
  program.eligibility_rules = <<~RULES
    - Company must have between 10-250 employees (SME criteria)
    - Minimum 2 years of operation
    - Active status with tax authorities
    - Innovation-focused projects (R&D, digitalization, green tech)
    - Located in eligible EU regions
    - Annual turnover between 2M - 50M EUR
  RULES
  program.pdf_content = <<~CONTENT
    SME INNOVATION SUPPORT PROGRAM

    OBJECTIVE:
    The SME Innovation Support Program aims to enhance the competitiveness of small and medium enterprises through innovation funding. The program supports projects in digitalization, sustainable technology, and market expansion.

    ELIGIBILITY CRITERIA:
    1. Enterprise Size: Must qualify as SME (10-250 employees)
    2. Operational History: Minimum 2 years in business
    3. Legal Status: Active registration with authorities
    4. Innovation Focus: Projects must demonstrate innovation potential
    5. Geographic Coverage: EU member state location
    6. Financial Capacity: Proven financial stability

    FUNDING DETAILS:
    - Grant amount: 50,000 - 500,000 EUR
    - Co-financing rate: 50-70% of eligible costs
    - Project duration: 12-36 months
    - Selection criteria: Innovation potential, market impact, sustainability

    APPLICATION PROCESS:
    Phase 1: Concept submission and preliminary assessment
    Phase 2: Detailed proposal development
    Phase 3: Technical and financial evaluation
    Phase 4: Grant agreement negotiation
  CONTENT
  program.active = true
end

FundingProgram.find_or_create_by!(title: "Digital Transformation Grant") do |program|
  program.description = "Accelerate your company's digital transformation with funding for technology adoption, digital infrastructure, and employee training in digital skills."
  program.eligibility_rules = <<~RULES
    - Companies with 5-500 employees
    - Must demonstrate digital transformation need
    - Investment in technology, software, or digital processes
    - Employee training component required
    - Minimum 30% co-financing from company
    - Located in EU territory
  RULES
  program.pdf_content = <<~CONTENT
    DIGITAL TRANSFORMATION GRANT PROGRAM

    OVERVIEW:
    This program supports enterprises in their digital transformation journey by providing financial assistance for technology adoption, process digitization, and workforce development.

    TARGET BENEFICIARIES:
    - Manufacturing companies
    - Service providers
    - Trade and retail businesses
    - Tourism and hospitality sector

    ELIGIBLE ACTIVITIES:
    - Implementation of digital technologies (IoT, AI, cloud computing)
    - Development of digital business models
    - Cybersecurity improvements
    - Digital marketing and e-commerce platforms
    - Employee digital skills training

    FINANCIAL SUPPORT:
    - Grant size: 25,000 - 200,000 EUR
    - Funding rate: 60% of eligible costs
    - Training costs: Up to 80% funding
    - Technology costs: Up to 50% funding

    EVALUATION CRITERIA:
    - Digital maturity assessment
    - Business impact potential
    - Sustainability of digital transformation
    - Involvement of employees in training
  CONTENT
  program.active = true
end

FundingProgram.find_or_create_by!(title: "Green Technology Initiative") do |program|
  program.description = "Support for companies developing or implementing environmentally friendly technologies, renewable energy solutions, and sustainable business practices."
  program.eligibility_rules = <<~RULES
    - Focus on environmental sustainability
    - Renewable energy or clean technology projects
    - Measurable environmental impact
    - Company size: 1-1000 employees
    - Established business with environmental compliance
    - Located in EU member states
  RULES
  program.pdf_content = <<~CONTENT
    GREEN TECHNOLOGY INITIATIVE

    MISSION:
    Supporting the transition to a sustainable economy by funding innovative green technology projects and environmental solutions.

    PRIORITY AREAS:
    1. Renewable Energy Systems
    2. Waste Management and Circular Economy
    3. Energy Efficiency Technologies
    4. Sustainable Transportation
    5. Green Building Solutions
    6. Environmental Monitoring Systems

    ELIGIBILITY REQUIREMENTS:
    - Demonstrated environmental benefit
    - Technical feasibility study
    - Market potential analysis
    - Compliance with environmental regulations
    - Financial sustainability plan

    FUNDING STRUCTURE:
    - Research & Development: Up to 75% funding
    - Demonstration Projects: Up to 60% funding
    - Market Deployment: Up to 40% funding
    - Grant range: 100,000 - 2,000,000 EUR

    IMPACT MEASUREMENT:
    - CO2 emission reduction
    - Energy savings achieved
    - Waste reduction metrics
    - Resource efficiency improvements
    - Job creation in green sectors
  CONTENT
  program.active = true
end

puts "✅ Created #{FundingProgram.count} funding programs"
puts "Run 'rails db:seed' to populate the database"
