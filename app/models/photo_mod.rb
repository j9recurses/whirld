class PhotoMod < ActiveRecord::Base
  belongs_to :mod_gallery, polymorphic: true
  belongs_to :photo

def self.get_mod_photos(photo_order)
    photos = photo_order.split(,)
    photos.each do |photo|
      unless photo.blank?
        photo = PhotoMod.find(photo.id)
      end
    end
  end
end
