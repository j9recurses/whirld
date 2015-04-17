class AddGalleryItems < ActiveRecord::Migration
  def change

    create_table :user_gallery_grids do |t|
      t.integer :user_gallery_id
      t.string :grid_photo_order
      t.timestamps
    end

    create_table :user_gallery_comparisons do |t|
      t.integer :user_gallery_id
      t.string :comparison_photo_order
      t.timestamps
    end

    create_table :user_gallery_splits do |t|
      t.integer :user_gallery_id
      t.text :split_text
      t.timestamps
    end

    create_table :photo_mods do |t|
      t.integer :photo_id
      t.text :caption
      t.integer :mod_gallery
      t.string :mod_type
    end
  add_index :photo_mods, [:mod_gallery, :mod_type]
  end
end
#
