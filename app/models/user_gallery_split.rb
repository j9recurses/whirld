class UserGallerySplit < ActiveRecord::Base
  belongs_to :user_gallery
  attr_accessible :split_text, :user_gallery_id
  has_many :photo_mods, as: :mod_gallery, dependent: :destroy
end
