class AddPhotos < ActiveRecord::Migration
  def up
     create_table :photos do |t|
       t.integer :user_gallery_id
       t.string :photo_file
       t.timestamps
     end

  create_table "user_galleries", :force => true do |t|
    t.string   "name"
    t.integer "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

     add_column :youtube_users, :created_at, :datetime
     add_column :youtube_users, :updated_at, :datetime
   end

   def down
     drop_table :photos
     drop_table :user_garlleries
     remove_column :youtube_users, :created_at
     remove_column :youtube_users, :updated_at
   end
end
