class AddWarpableids < ActiveRecord::Migration
  def up
    add_column :photos, :warpable_id, :integer
    add_column :photos, :warpable_url, :string
    add_column :photos, :warpable_thumb_url,  :string
  end

  def down
    remove_column :photos, :warpable_id
    remove_column :photos, :warpable_url
    remove_column :photos, :warpable_thumb_url
  end
end
