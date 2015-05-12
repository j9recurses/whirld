class Dropweirduserid < ActiveRecord::Migration
  def up
    remove_column :user_gallery_bloc_texts,:user_id
  end

  def down
    add_column :user_gallery_bloc_texts,:user_id, :integer
  end
end
