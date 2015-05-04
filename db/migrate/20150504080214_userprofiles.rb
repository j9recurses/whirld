class Userprofiles < ActiveRecord::Migration
  def up
    remove_column :users, :name
    create_table :user_profiles, :force => true do |t|
      t.integer :user_id
      t.string :location
      t.decimal  :lat, :precision => 20, :scale => 10, :default => 0.0
      t.decimal  :lon, :precision => 20, :scale => 10, :default => 0.0
      t.text :description
      t.string :first_name
      t.string :last_name
    end
    add_index "user_profiles", ["user_id"], :name => "index_user_profiles_on_user_id", :unique => true
  end

  def down
    drop_table "user_profiles"
    add_column :users, :name, :string
  end

end

