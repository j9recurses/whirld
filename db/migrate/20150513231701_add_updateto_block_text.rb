class AddUpdatetoBlockText < ActiveRecord::Migration
  def up
    add_column :user_gallery_bloc_texts,:updated_at, :date
    add_column :user_gallery_bloc_texts,:created_at, :date
  end

  def down
     remove_column :user_gallery_bloc_texts,:updated_at
      remove_column :user_gallery_bloc_texts,:created_at
  end
end
