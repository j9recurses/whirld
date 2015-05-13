class AddusergalleryBlockUid < ActiveRecord::Migration
  def up
     add_column :user_gallery_bloc_texts,:user_id, :integer
  end

  def down
     remove_column :user_gallery_bloc_texts,:user_id
  end

end
