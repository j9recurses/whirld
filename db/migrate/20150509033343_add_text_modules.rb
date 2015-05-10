class AddTextModules < ActiveRecord::Migration
  def up
    add_column :user_gallery_grids, :grid_text, :text
    add_column :user_gallery_comparisons, :comparison_text, :text
  end

  def down
    remove_column :user_gallery_grids, :grid_text
    remove_column :user_gallery_comparisons, :comparison_text
  end

end
