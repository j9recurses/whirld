class Addtaggings < ActiveRecord::Migration
  def up
     create_table :tags do |t|
      t.string :name
      t.integer :taggable_id
      t.string :taggable_type
      t.integer :user_id
      t.timestamps
    end
  end

  def down
    drop_table :tags
  end
end
