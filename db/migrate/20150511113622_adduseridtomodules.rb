class Adduseridtomodules < ActiveRecord::Migration
  def up
      add_column :user_gallery_grids, :user_id, :integer
      add_column :user_gallery_comparisons,  :user_id, :integer
      add_column :user_gallery_splits,  :user_id, :integer
      add_column  :user_gallery_bloc_texts,  :user_id, :integer
  end

  def down
      remove_column :user_gallery_grids
      remove_column :user_gallery_comparisons
      remove_column :user_gallery_splits
      remove_column :user_gallery_bloc_texts
  end
end
