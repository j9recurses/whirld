class FixYoutubeUsers < ActiveRecord::Migration
  def up
    remove_column :youtube_users, :userid
    add_column :youtube_users, :user_id, :integer
  end

  def down
    add_column :youtube_users, :userid, :integer
    remove_column :youtube_users, :user_id
  end
end
