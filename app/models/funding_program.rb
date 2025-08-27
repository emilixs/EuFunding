class FundingProgram < ApplicationRecord
  validates :title, presence: true

  has_many :company_program_checks, dependent: :destroy
  has_many :companies, through: :company_program_checks

  scope :active, -> { where(active: true) }
end
