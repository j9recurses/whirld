class RemoveNameNameFromUserGallery < ActiveRecord::Migration
  def up
     remove_column :user_galleries, :name
   # remove_column :maps, :author
  end

  def down
     add_column :user_galleries, :name, :string
      #add_column :maps, :author, :string
  end
end
