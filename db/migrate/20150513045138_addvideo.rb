class Addvideo < ActiveRecord::Migration
  def up
  add_column :videos,:video_text, :text
  add_column :videos, :user_id, :integer
  end

  def down
    remove_column :videos, :video_text
    remove_column :videos, :user_id
  end
end

