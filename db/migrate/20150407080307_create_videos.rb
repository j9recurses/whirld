class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.string :link
      t.string :title
      t.string :author
      t.string :duration
      t.integer :likes
      t.integer :dislikes
      t.date :vid_date
      t.time :vid_time
      t.integer :user_id
      t.integer :map_id
      t.string  :title
      t.string :description
      t.string :yt_video_id
      t.boolean :is_complete, :default => false
      t.timestamps
    end
 end
end
