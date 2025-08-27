class CompanyProgramCheck < ApplicationRecord
  belongs_to :company
  belongs_to :funding_program

  validates :eligible, inclusion: { in: [ true, false ] }
  validates :company_id, uniqueness: { scope: :funding_program_id }
end
