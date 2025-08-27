class ListaFirmeClient
  def self.fetch(cui)
    new.fetch_company(cui)
  end

  # Method to view recent API logs (for debugging)
  def self.show_recent_logs(lines = 50)
    log_file = Rails.root.join("log", "development.log")
    if File.exist?(log_file)
      puts "📋 Last #{lines} ListaFirme API log entries:"
      puts "=" * 60
      `tail -n 1000 #{log_file}`.split("\n").select { |line|
        line.include?("[ListaFirme API]")
      }.last(lines).each { |line| puts line }
    else
      puts "❌ Log file not found: #{log_file}"
    end
  end

  def initialize
    @base_url = "https://www.listafirme.ro/api/info-v1.asp"
    @api_key = Rails.application.credentials.lista_firme_api_key || ENV["LISTA_FIRME_API_KEY"]
    puts "DEBUG: API Key loaded: #{@api_key.present? ? 'YES' : 'NO'}"
    puts "DEBUG: Using correct endpoint: #{@base_url}"
  end

  def fetch_company(cui)
    # Clean the CUI (remove RO prefix if present)
    clean_cui = cui.gsub(/^RO/, "")

    # Comprehensive request logging
    Rails.logger.info "[ListaFirme API] Starting company lookup for CUI: #{clean_cui}"
    Rails.logger.info "[ListaFirme API] Request URL: #{@base_url}"
    Rails.logger.info "[ListaFirme API] API Key present: #{@api_key.present?}"
    Rails.logger.info "[ListaFirme API] API Key (masked): #{@api_key ? @api_key[0..8] + '***' : 'NONE'}"

    # Use complete data object format from documentation
    data_param = {
      TaxCode: clean_cui,
      VAT: "",
      RegNo: "",
      Status: "",
      LegalForm: "",
      Name: "",
      NACE: "",
      Date: "",
      TownCode: "",
      County: "",
      City: "",
      Address: "",
      Administrators: "",
      Shareholders: "",
      Balance: "latest",
      Phone: "",
      Mobile: "",
      Fax: "",
      Email: "",
      Web: "",
      Geolocation: "",
      Description: "",
      Trademarks: "",
      Subsidiaries: "",
      Branches: "",
      FiscalActivity: "",
      Obligations: "",
      Links: ""
    }.to_json

    Rails.logger.info "[ListaFirme API] Request data parameter: #{data_param}"

    request_body = URI.encode_www_form({
      key: @api_key,
      data: data_param
    })
    Rails.logger.info "[ListaFirme API] Encoded request body: #{request_body}"

    # Log request timing
    start_time = Time.current
    Rails.logger.info "[ListaFirme API] Sending POST request at #{start_time}"

    response = Faraday.post(@base_url) do |req|
      req.headers["Content-Type"] = "application/x-www-form-urlencoded"
      req.headers["User-Agent"] = "EuFunding/1.0 (Ruby #{RUBY_VERSION})"
      req.body = request_body
    end

    end_time = Time.current
    response_time = ((end_time - start_time) * 1000).round(2)

    # Comprehensive response logging
    Rails.logger.info "[ListaFirme API] Response received in #{response_time}ms"
    Rails.logger.info "[ListaFirme API] Response Status: #{response.status} #{response.reason_phrase}"
    Rails.logger.info "[ListaFirme API] Response Headers: #{response.headers.to_h}"
    Rails.logger.info "[ListaFirme API] Response Content-Type: #{response.headers['content-type']}"
    Rails.logger.info "[ListaFirme API] Response Content-Length: #{response.headers['content-length'] || 'Unknown'}"
    Rails.logger.info "[ListaFirme API] Response Body Length: #{response.body.length} characters"
    Rails.logger.info "[ListaFirme API] Response Body: #{response.body}"

    # Debug console output (can be removed in production)
    puts "🔗 [API REQUEST] #{@base_url} - CUI: #{clean_cui}"
    puts "⏱️  [API TIMING] Response in #{response_time}ms"
    puts "📊 [API RESPONSE] Status: #{response.status}, Length: #{response.body.length} chars"

    if response.success?
      begin
        Rails.logger.info "[ListaFirme API] Parsing JSON response..."
        parsed_response = JSON.parse(response.body)
        Rails.logger.info "[ListaFirme API] JSON parsed successfully"
        Rails.logger.debug "[ListaFirme API] Parsed data keys: #{parsed_response.keys}"

        if parsed_response["error"]
          error_msg = "ListaFirme API Error: #{parsed_response['error']}"
          Rails.logger.error "[ListaFirme API] #{error_msg}"
          raise error_msg
        elsif parsed_response["Name"].present?
          Rails.logger.info "[ListaFirme API] Company found: #{parsed_response['Name']}"
          Rails.logger.info "[ListaFirme API] Company status: #{parsed_response['Status']}"
          Rails.logger.info "[ListaFirme API] VAT status: #{parsed_response['VAT']}"
          Rails.logger.info "[ListaFirme API] Legal form: #{parsed_response['LegalForm']}"

          # Log financial data extraction
          balance_data = parsed_response.dig("Balance", 0)
          if balance_data
            Rails.logger.info "[ListaFirme API] Financial data found - Year: #{balance_data['Year']}"
            Rails.logger.info "[ListaFirme API] Turnover: #{balance_data['Turnover']}, Employees: #{balance_data['Employees']}"
            Rails.logger.info "[ListaFirme API] Net Profit: #{balance_data['NetProfit']}"
          else
            Rails.logger.warn "[ListaFirme API] No balance/financial data available"
          end

          # Map ListaFirme data to our expected format
          mapped_data = {
            "TaxCode" => clean_cui,
            "Name" => parsed_response["Name"],
            "Status" => parsed_response["Status"] == "functiune" ? "Active" : "Inactive",
            "FiscalActivity" => parsed_response["VAT"] == "True" ? "Active" : "Inactive",
            "LegalForm" => parsed_response["LegalForm"],
            "Date" => parsed_response["Date"],
            "County" => parsed_response["County"],
            "City" => parsed_response["City"],
            "Address" => parsed_response["Address"],
            "NACE" => parsed_response["NACE"],
            "Turnover" => balance_data&.dig("Turnover")&.to_i || 0,
            "Profit" => balance_data&.dig("NetProfit")&.to_i || 0,
            "Employees" => balance_data&.dig("Employees")&.to_i || 0,
            "_source" => "api",
            "_raw_data" => parsed_response  # Keep full data for reference
          }

          Rails.logger.info "[ListaFirme API] Data mapping completed successfully"
          Rails.logger.info "[ListaFirme API] Final mapped data - Employees: #{mapped_data['Employees']}, Turnover: €#{mapped_data['Turnover']}"

          puts "✅ [API SUCCESS] #{mapped_data['Name']} - #{mapped_data['Employees']} employees, €#{mapped_data['Turnover']} turnover"

          mapped_data
        else
          error_msg = "API response missing company name: #{parsed_response.keys}"
          Rails.logger.error "[ListaFirme API] #{error_msg}"
          raise error_msg
        end
      rescue JSON::ParserError => e
        error_msg = "Invalid JSON response: #{e.message}. Response: #{response.body[0..200]}..."
        Rails.logger.error "[ListaFirme API] #{error_msg}"
        raise error_msg
      end
    else
      error_msg = "HTTP Error #{response.status}: #{response.body}"
      Rails.logger.error "[ListaFirme API] #{error_msg}"
      raise error_msg
    end
  rescue => e
    Rails.logger.error "[ListaFirme API] Unexpected error during company lookup for CUI #{clean_cui}: #{e.class} - #{e.message}"
    Rails.logger.error "[ListaFirme API] Error backtrace: #{e.backtrace.first(3).join("\n")}"

    puts "❌ [API ERROR] #{e.message}"

    { "error" => e.message }
  end

  private

  # Realistic mock response based on entered CUI
  def realistic_mock_response(cui)
    # Clean the CUI for consistent display
    clean_cui = cui.gsub(/^RO/, "")

    # Generate more realistic data based on the CUI
    company_names = [
      "TECH SOLUTIONS SRL",
      "DIGITAL INNOVATIONS SRL",
      "GREEN ENERGY SRL",
      "MODERN SYSTEMS SRL",
      "ADVANCED CONSULTING SRL"
    ]

    counties = [ "Bucharest", "Cluj", "Timis", "Iasi", "Constanta" ]
    cities = [ "Sector 1", "Cluj-Napoca", "Timisoara", "Iasi", "Constanta" ]

    # Use CUI to seed randomness for consistent results
    seed = clean_cui.to_i % 1000

    {
      "TaxCode" => clean_cui,
      "Name" => company_names[seed % company_names.length],
      "Status" => "Active",
      "FiscalActivity" => "Active",
      "LegalForm" => "SRL",
      "Date" => "#{2015 + (seed % 8)}-#{sprintf('%02d', (seed % 12) + 1)}-#{sprintf('%02d', (seed % 28) + 1)}",
      "County" => counties[seed % counties.length],
      "City" => cities[seed % cities.length],
      "Address" => "Str. #{[ 'Victoriei', 'Unirii', 'Libertății', 'Independenței' ][seed % 4]} Nr. #{(seed % 300) + 1}",
      "NACE" => [ "6201", "6202", "7022", "4651", "6311" ][seed % 5],
      "Turnover" => (500000 + (seed * 1000)) % 5000000,
      "Profit" => ((500000 + (seed * 1000)) % 5000000) / 10,
      "Employees" => [ 5, 12, 25, 45, 78, 120, 200 ][(seed % 7)],
      "_source" => "mock"
    }
  end

  # Keep original mock for backward compatibility
  def mock_response(cui)
    realistic_mock_response(cui)
  end
end
