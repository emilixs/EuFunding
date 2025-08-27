module ApplicationHelper
  # Parse AI analysis response into structured data
  def parse_ai_analysis(text)
    data = { acceptate: [], refuzate: [], nevalidate: [], result: nil, raw_text: text.to_s }
    current_section = nil

    text.to_s.each_line do |line|
      stripped = line.strip

      # Detect section headers
      if stripped =~ /^ACCEPTATE:/i
        current_section = :acceptate
        next
      elsif stripped =~ /^REFUZATE:/i
        current_section = :refuzate
        next
      elsif stripped =~ /^NEVALIDATE:/i
        current_section = :nevalidate
        next
      elsif stripped =~ /^REZULTAT:\s*(ELIGIBILĂ|NU_ESTE_ELIGIBILĂ)/i
        data[:result] = $1.upcase
        next
      end

      # Extract bullet points for current section
      if current_section && stripped.start_with?("-")
        rule_text = stripped.sub(/^-\s*/, "")

        # Split on first colon to separate criterion from explanation
        if rule_text.include?(":")
          criterion, explanation = rule_text.split(":", 2).map(&:strip)
        else
          criterion = rule_text
          explanation = ""
        end

        data[current_section] << {
          criterion: criterion,
          explanation: explanation,
          full_text: rule_text
        }
      end
    end

    # Normalize false positives - remove "no criteria" meta statements
    # Remove blocking criteria that are actually "no criteria" statements
    data[:refuzate].reject! do |item|
      text = item[:full_text].to_s.downcase
      text.match?(/nu exist[aă] .* criterii .* (refuz|respins)/i) ||
      text.match?(/nu sunt .* criterii .* (refuz|respins)/i) ||
      text.match?(/nu avem .* criterii .* (refuz|respins)/i) ||
      text.match?(/nu se identific[aă] .* criterii .* (refuz|respins)/i) ||
      text.match?(/toate criteriile sunt (acceptate|îndeplinite)/i) ||
      text.match?(/nu exist[aă] .* motive .* (refuz|respins)/i)
    end

    # Remove missing info criteria that are actually "no missing info" statements
    data[:nevalidate].reject! do |item|
      text = item[:full_text].to_s.downcase
      text.match?(/nu exist[aă] .* informa[tț]ii .* lips[aă]/i) ||
      text.match?(/nu sunt .* informa[tț]ii .* lips[aă]/i) ||
      text.match?(/toate informa[tț]iile sunt .* disponibile/i) ||
      text.match?(/nu se identific[aă] .* informa[tț]ii .* lips[aă]/i)
    end

    data
  end

  # Get eligibility status info for display
  def eligibility_status_info(result)
    case result&.upcase
    when "ELIGIBILĂ"
      {
        status: "eligible",
        text: "✅ ELIGIBILĂ",
        class: "alert-success",
        icon: "✅"
      }
    when "NU_ESTE_ELIGIBILĂ"
      {
        status: "ineligible",
        text: "❌ NU ESTE ELIGIBILĂ",
        class: "alert-error",
        icon: "❌"
      }
    else
      {
        status: "unknown",
        text: "⚠️ STATUS NECUNOSCUT",
        class: "alert-warning",
        icon: "⚠️"
      }
    end
  end
end
