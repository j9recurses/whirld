class Userprofilephotos < ActiveRecord::Migration
  def up
    add_column :user_profiles, :photo_file, :string
  end

  def down
    remove_column :user_profiles, :photo_file
  end
end
