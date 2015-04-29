class PhotoMod < ActiveRecord::Base
  belongs_to :mod_gallery, polymorphic: true
  belongs_to :photo

  def self.gather_mod_photos(photo_order)
    allphotos = Array.new
    unless photo_order.nil? or photo_order.blank?
      photos = photo_order.split(",")
      photos.each do |photo|
        photo_info = Array.new
        unless photo.blank?
          photo_mod = PhotoMod.find(photo.to_i)
          unless photo_mod.blank?
            photo_img = Photo.find( photo_mod.photo_id)
            photo_info << photo_img
            photo_info << photo_mod
            allphotos << photo_info
          end
        end
      end
    end
    return allphotos
  end

  def self.gather_mod_photo(mod_gallery_type, mod_gallery_id )
    photo_info = Array.new
    photo_mod = PhotoMod.where(["mod_gallery_type = ? and mod_gallery_id = ?" , mod_gallery_type, mod_gallery_id])
    unless photo_mod.blank?
          photo_img = Photo.find(photo_mod[0].photo_id)
          photo_info << photo_img
    end
    return photo_info
  end

end
