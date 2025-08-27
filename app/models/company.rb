class Company < ApplicationRecord
  validates :cui, presence: true, uniqueness: true

  has_many :company_program_checks, dependent: :destroy
  has_many :funding_programs, through: :company_program_checks

  def company_name
    api_response&.dig("Name") || "Unknown Company"
  end

  def company_status
    api_response&.dig("Status") || "Unknown"
  end

  def using_mock_data?
    api_response&.dig("_source") == "mock"
  end

  def data_source_info
    if using_mock_data?
      "⚠️ Demo Data - API service unavailable"
    else
      "✅ Live API Data"
    end
  end
end
