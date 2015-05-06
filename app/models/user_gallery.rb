class UserGallery < ActiveRecord::Base
  attr_accessible :name, :map_id, :user_id
  belongs_to :map
  has_many :photos, :dependent => :destroy
  has_many :user_gallery_grids, dependent: :destroy
  has_many :user_gallery_splits,  dependent: :destroy
  has_many :user_gallery_bloc_texts, dependent: :destroy
  has_many  :user_gallery_comparisons , dependent: :destroy
  serialize :module_order
  validates_presence_of :name
  validates_uniqueness_of :name


  def at_least_one_photo?
    self.photos.present?
  end

  def self.gather_gallery_mods(map_id)
    user_gallery = UserGallery.where(['map_id = ?', map_id]).first
    block_texts  = UserGalleryBlocText.gather_bloc_texts(user_gallery[:id])
    gallery_grids = UserGalleryGrid.gather_gallery_grids(user_gallery[:id])
    gallery_comparisons = UserGalleryComparison.gather_gallery_comparisions(user_gallery[:id])
    gallery_splits = UserGallerySplit.gather_gallery_splits(user_gallery[:id])
    gallery_mods = {"block_text"=> block_texts, "gallery_grids"=> gallery_grids,"gallery_comparisons"=> gallery_comparisons, "gallery_splits"=> gallery_splits }
    return gallery_mods
  end

end
