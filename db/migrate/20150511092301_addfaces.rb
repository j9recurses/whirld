class Addfaces < ActiveRecord::Migration
  def up
    add_column :photos, :is_faces, :boolean
    add_column :photos, :no_faces, :boolean
  end

  def down
    remove_column :photos, :is_faces
    remove_column :photos, :no_faces
  end
end
