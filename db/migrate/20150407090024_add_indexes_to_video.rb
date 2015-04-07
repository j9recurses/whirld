class AddIndexesToVideo < ActiveRecord::Migration
  def up
    add_index :videos, :user_id
    add_index :videos, :map_id
  end
  def down
    remove_index :videos, :user_id
    remove_index :videos, :map_id
  end
end
