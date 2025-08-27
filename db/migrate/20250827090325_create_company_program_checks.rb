class CreateCompanyProgramChecks < ActiveRecord::Migration[8.0]
  def change
    create_table :company_program_checks do |t|
      t.references :company, null: false, foreign_key: true
      t.references :funding_program, null: false, foreign_key: true
      t.boolean :eligible
      t.text :ai_response

      t.timestamps
    end
  end
end
