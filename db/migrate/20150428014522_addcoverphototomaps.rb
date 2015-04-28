class Addcoverphototomaps < ActiveRecord::Migration
  def up
     add_column :maps, :coverphoto, :integer
  end

  def down
     remove_column :maps, :coverphoto
  end
end
