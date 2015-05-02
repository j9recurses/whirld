class RemoveDefautlTileurl < ActiveRecord::Migration
  def up
    change_column :maps, :tile_url, :text, :null => true
  end

  def down
  end
end
