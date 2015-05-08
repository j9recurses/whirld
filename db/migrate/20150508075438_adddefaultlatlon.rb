class Adddefaultlatlon < ActiveRecord::Migration
  def up
    change_column_default(:maps, :finished, 1)
  end

  def down
  end
end
