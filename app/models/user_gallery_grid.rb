class UserGalleryGrid < ActiveRecord::Base
  serialize :grid_order
  belongs_to :user_gallery
  attr_accessible :grid_order, :user_gallery_id
  has_many :photo_mods, as: :mod_gallery, dependent: :destroy
  has_many :tags, :as => :taggable, dependent: :destroy

  def self.gather_gallery_grids(user_gallery_id)
    combined_gallery_grids = Array.new
    gallery_grids = UserGalleryGrid.where(['user_gallery_id = ?', user_gallery_id])
    unless gallery_grids.blank?
      gallery_grids.each do |grid|
        grid_tags  = Tag.gather_tag(grid)
        photos = PhotoMod.gather_mod_photos(grid.grid_photo_order)
        grid = grid.attributes
        grid[:photos] = photos
        grid[:taglist] =  grid_tags
        combined_gallery_grids  << grid
      end
    end
    return combined_gallery_grids
  end



end
