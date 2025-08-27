class CreateCompanies < ActiveRecord::Migration[8.0]
  def change
    create_table :companies do |t|
      t.string :cui
      t.json :api_response

      t.timestamps
    end
  end
end
