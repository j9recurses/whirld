class Addmapcoverphoto < ActiveRecord::Migration
  def up
     add_column :maps, :photo_file, :string
  end

  def down
     add_column :maps, :photo_file
  end
end
