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
    puts "*****in here*****"
    user_gallery = UserGallery.where(['map_id = ?', map_id]).first
    #block text mods
    block_texts  = UserGalleryBlocText.gather_bloc_texts(user_gallery[:id])
    #gallery_grids = UserGalleryGrid.gather_gallery_grids(user_gallery[:id])
    puts block_texts.inspect
  end

end
