class PhotoMod < ActiveRecord::Base
  belongs_to :mod_gallery, polymorphic: true
  belongs_to :photo
end
