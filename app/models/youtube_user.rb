class YoutubeUser < ActiveRecord::Base

  attr_accessible :token, :uid, :user_id, :youtube_name

  has_many :videos

end
