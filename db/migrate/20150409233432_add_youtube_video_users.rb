class AddYoutubeVideoUsers < ActiveRecord::Migration
  def up
    remove_column :users, :uid

    create_table :youtube_users do |t|
      t.string :youtube_name
      t.string :token
      t.string :uid
      t.integer :userid
    end
  end

  def down
    drop_table :youtube_users
    add_column :users, :uid, :string
  end
end
