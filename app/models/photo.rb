class Photo < ActiveRecord::Base
attr_accessible :photo_file, :user_id
  belongs_to :user_galleries

  mount_uploader :photo_file, PhotoFileUploader
end
