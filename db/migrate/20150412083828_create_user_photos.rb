class CreateUserPhotos < ActiveRecord::Migration
  def up
    create_table :photos do |t|
      t.integer :user_id
      t.string :text
      t.timestamps
    end
    add_column :youtube_users, :created_at, :datetime
    add_column :youtube_users, :updated_at, :datetime
  end

  def down
    drop_table :photos
    remove_column :youtube_users, :created_at
    remove_column :youtube_users, :updated_at
  end
end
