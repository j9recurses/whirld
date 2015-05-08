class Adddefaultlatlon < ActiveRecord::Migration
  def up
    remove_column :user_profiles, :photo_id
  end

  def down
    add_column :user_profiles, :photo_id, :integer
  end
end
