class AdduidToVideos < ActiveRecord::Migration
  def up
    add_column :videos, :uid, :string
  end

  def down
    remove_column :videos, :uid, :string
  end
end
