class Photo < ActiveRecord::Base
  attr_accessible :photo_file, :user_gallery_id
  belongs_to :user_gallery
  mount_uploader :photo_file, PhotoFileUploader
end
