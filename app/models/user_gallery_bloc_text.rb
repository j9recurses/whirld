 class UserGalleryBlocText < ActiveRecord::Base
  belongs_to :user_gallery
  attr_accessible :bloc_text, :user_gallery_id
end
