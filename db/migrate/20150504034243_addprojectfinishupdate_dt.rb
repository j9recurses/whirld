class AddprojectfinishupdateDt < ActiveRecord::Migration
  def up
    add_column :maps, :finished_dt, :datetime
  end

  def down
     remove_column :maps, :finished_dt, :datetime
  end
end
