class ChangePhotoModsColumn < ActiveRecord::Migration
  def up
    rename_column :photo_mods, :mod_gallery, :mod_gallery_id
  end

  def down
    rename_column :photo_mods, :mod_gallery_id, :mod_gallery
  end
end
