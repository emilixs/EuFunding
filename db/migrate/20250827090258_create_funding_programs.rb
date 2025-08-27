class CreateFundingPrograms < ActiveRecord::Migration[8.0]
  def change
    create_table :funding_programs do |t|
      t.string :title
      t.text :description
      t.text :pdf_content
      t.text :eligibility_rules
      t.boolean :active

      t.timestamps
    end
  end
end
