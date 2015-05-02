class RemoveEmailfromMaps < ActiveRecord::Migration
  def up
     remove_column :maps, :email
  end

  def down
     add_column :maps, :email, :string
  end
end
