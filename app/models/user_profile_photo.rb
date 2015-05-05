class UserProfilePhoto < ActiveRecord::Base
  attr_accessible :photo_file, :user_id, :user_profile_id
  belongs_to :users
  belongs_to :user_profiles
  mount_uploader :photo_file, UserProfileUploader
  include PublicActivity::Model
   tracked owner: Proc.new{ |controller, model| controller.current_user }
end
