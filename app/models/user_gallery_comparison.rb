class UserGalleryComparison < ActiveRecord::Base
  serialize :grid_order
  belongs_to :user_gallery
  attr_accessible :comparison_order, :user_gallery_id
  has_many :photo_mods, as: :mod_gallery, dependent: :destroy
   has_many :tags, :as => :taggable
end
