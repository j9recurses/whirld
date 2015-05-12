class AddUsergalleryToVid < ActiveRecord::Migration
  def up
    add_column :videos, :user_gallery_id,  :integer
  end

  def down
    remove_column :videos , :user_gallery_id
  end

end
