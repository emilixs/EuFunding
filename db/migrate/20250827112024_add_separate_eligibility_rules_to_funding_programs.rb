class AddSeparateEligibilityRulesToFundingPrograms < ActiveRecord::Migration[8.0]
  def change
    add_column :funding_programs, :company_eligibility_rules, :text
    add_column :funding_programs, :project_eligibility_rules, :text
  end
end
