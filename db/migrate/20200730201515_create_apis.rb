class CreateApis < ActiveRecord::Migration[6.0]
  def change
    create_table :apis do |t|
      t.string :summonerName
      t.string :summonerID

      t.timestamps
    end
  end
end
