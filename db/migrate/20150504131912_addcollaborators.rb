class Addcollaborators < ActiveRecord::Migration
  def up
     create_table :collaborators, :force => true do |t|
      t.integer :user_id
      t.integer :map_id
    end
     add_index "collaborators", ["user_id"], :name => "index_collaborators_on_user_id"
     add_index "collaborators", ["map_id"], :name => "index_collaborators_on_map_id"
  end

  def down
    drop_table :collaborators
  end
end
