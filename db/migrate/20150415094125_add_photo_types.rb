class AddPhotoTypes < ActiveRecord::Migration
  def up
   add_column :photos, :is_aerial, :boolean, :default => false
   add_column :photos, :is_normal, :boolean, :default => false
  end

  def down
    remove_column :photos, :is_normal
    remove_column :photos, :is_aerial
  end
end
