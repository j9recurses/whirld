class AddphototouserProfile < ActiveRecord::Migration
  def up
    add_column :user_profiles, :photo_id, :integer
  end

  def down
    remove_column :user_profiles, :photo_id, :integer
  end
end
