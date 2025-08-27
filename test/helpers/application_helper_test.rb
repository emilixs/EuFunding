require "test_helper"

class ApplicationHelperTest < ActionView::TestCase
  test "parse_ai_analysis extracts structured data correctly" do
    sample_text = <<~TEXT
      Din moment ce în documentația furnizată pentru programul Green Technology Initiative nu sunt specificate criterii concrete de eligibilitate, voi analiza datele disponibile ale companiei din perspectiva generală a capacității de implementare:

      ACCEPTATE:
      - Statut juridic: Compania este activă și înregistrată legal ca SRL
      - Capacitate financiară: Cu o cifră de afaceri de 22.538.871 lei și profit de 2.008.333 lei, compania demonstrează stabilitate financiară
      - Resurse umane: 47 de angajați indică o capacitate solidă de implementare
      - Domeniu de activitate: Codul CAEN 6202 (Activități de consultanță în tehnologia informației) este compatibil cu inițiativele tehnologice verzi
      - Vechime: Cu o vechime de peste 6 ani (înființată în 2017), compania are experiență suficientă

      REFUZATE:
      - Nu există criterii specificate care să poată fi refuzate

      NEVALIDATE:
      - Experiența în proiecte similare: Nu avem informații despre implicarea anterioară în proiecte verzi sau de mediu
      - Certificări de mediu: Nu există informații despre eventuale certificări relevante pentru tehnologii verzi
      - Capacitatea tehnică specifică: Nu sunt disponibile date despre infrastructura tehnică existentă

      DECIZIA FINALĂ: Având în vedere că nu există criterii specifice de eligibilitate menționate și că toate aspectele generale verificabile sunt îndeplinite (doar câteva aspecte rămân nevalidate din lipsa informațiilor), iar niciun criteriu nu este refuzat:

      REZULTAT: ELIGIBILĂ

      Notă: Pentru o evaluare completă și definitivă, ar fi necesară specificarea criteriilor concrete de eligibilitate ale programului Green Technology Initiative.
    TEXT

    result = parse_ai_analysis(sample_text)

    # Test basic structure
    assert_not_nil result
    assert result.has_key?(:acceptate)
    assert result.has_key?(:refuzate)
    assert result.has_key?(:nevalidate)
    assert result.has_key?(:result)

    # Test ACCEPTATE section
    assert_equal 5, result[:acceptate].size
    assert_equal "Statut juridic", result[:acceptate][0][:criterion]
    assert_includes result[:acceptate][0][:explanation], "Compania este activă"

    # Test REFUZATE section
    assert_equal 1, result[:refuzate].size
    assert_equal "Nu există criterii specificate care să poată fi refuzate", result[:refuzate][0][:criterion]

    # Test NEVALIDATE section
    assert_equal 3, result[:nevalidate].size
    assert_equal "Experiența în proiecte similare", result[:nevalidate][0][:criterion]

    # Test result extraction
    assert_equal "ELIGIBILĂ", result[:result]
  end

  test "eligibility_status_info returns correct info for eligible status" do
    info = eligibility_status_info("ELIGIBILĂ")

    assert_equal "eligible", info[:status]
    assert_equal "✅ ELIGIBILĂ", info[:text]
    assert_equal "alert-success", info[:class]
    assert_equal "✅", info[:icon]
  end

  test "eligibility_status_info returns correct info for ineligible status" do
    info = eligibility_status_info("NU_ESTE_ELIGIBILĂ")

    assert_equal "ineligible", info[:status]
    assert_equal "❌ NU ESTE ELIGIBILĂ", info[:text]
    assert_equal "alert-error", info[:class]
    assert_equal "❌", info[:icon]
  end

  test "eligibility_status_info handles unknown status" do
    info = eligibility_status_info("UNKNOWN")

    assert_equal "unknown", info[:status]
    assert_equal "⚠️ STATUS NECUNOSCUT", info[:text]
    assert_equal "alert-warning", info[:class]
    assert_equal "⚠️", info[:icon]
  end
end
