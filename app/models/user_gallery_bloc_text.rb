 class UserGalleryBlocText < ActiveRecord::Base
  belongs_to :user_gallery
  has_many :tags, :as => :taggable, dependent: :destroy
  attr_accessible :bloc_text, :user_gallery_id
end
