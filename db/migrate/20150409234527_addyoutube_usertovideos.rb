class AddyoutubeUsertovideos < ActiveRecord::Migration
  def up
    add_column :videos, :youtube_user_id, :integer
  end

  def down
    remove_column :videos, :youtube_user_id, :integer
  end
end
