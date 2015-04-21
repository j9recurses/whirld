class UserGallery < ActiveRecord::Base
  attr_accessible :name, :map_id, :user_id
  belongs_to :map
  has_many :photos, :dependent => :destroy
  has_many :user_gallery_grids, dependent: :destroy
  has_many :user_gallery_splits,  dependent: :destroy
  has_many :user_gallery_bloc_texts, dependent: :destroy
  has_many  :user_gallery_comparisons , dependent: :destroy
  validates_presence_of :name
  validates_uniqueness_of :name

  def at_least_one_photo?
    self.photos.present?
  end

end
