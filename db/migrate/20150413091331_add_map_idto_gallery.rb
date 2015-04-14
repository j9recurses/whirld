class AddMapIdtoGallery < ActiveRecord::Migration
  def up
    add_column :user_galleries, :map_id, :integer
  end

  def down
    remove_column :user_galleries, :map_id
  end
end
