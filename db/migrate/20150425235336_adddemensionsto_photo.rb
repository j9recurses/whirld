class AdddemensionstoPhoto < ActiveRecord::Migration
  def up
    add_column :photos, :width, :integer
    add_column :photos, :height, :integer
    add_column :photos, :content_type, :string
    add_column :photos, :file_size, :integer
  end

  def down
    remove_column :photos, :width
    remove_column :photos, :height
    remove_column :photos, :content_type
    remove_column :photos, :file_size
  end
end
