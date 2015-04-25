class Addmoduletousergallery < ActiveRecord::Migration
  def up
    add_column :user_galleries, :module_order, :string
    add_column :maps, :finished, :boolean, :default => true
  end

  def down
    remove_column :user_galleries, :module_order
    remove_column :maps, :finished
  end
end
