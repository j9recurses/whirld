class ChangePhotoModsModTypeColumn < ActiveRecord::Migration
  def up
      rename_column :photo_mods, :mod_type, :mod_gallery_type
  end

  def down
    rename_column :photo_mods, :mod_gallery_type, :mod_type
  end
end

