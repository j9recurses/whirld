class AddTextModule < ActiveRecord::Migration
  def change
    create_table :user_gallery_bloc_texts do |t|
      t.integer :user_gallery_id
      t.text :bloc_text
    end
  end
end
