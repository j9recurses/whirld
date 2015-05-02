class RemovetileUrl < ActiveRecord::Migration
  def up
     change_column_default :maps, :tile_url, nil
  end


end
