class RemoveTileUrl < ActiveRecord::Migration
  def  change
    remove_column :maps, :tile_url
    add_column :maps, :tile_url, :text
  end

end
