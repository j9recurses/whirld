class Video < ActiveRecord::Base
  belongs_to :user
  belongs_to :user_gallery
  has_many :tags, :as => :taggable, dependent: :destroy
  acts_as_votable
  acts_as_commentable
  attr_accessible :link, :map_id, :title, :user_id, :youtube_user_id, :vid_date, :vid_time, :description, :user_gallery_id
  attr_accessor  :taglist, :user_login, :photos, :user_whirled, :comment_cnt, :comments, :whirls


def self.gather_videos(user_gallery_id)
    combined_videos = Array.new
    videos = Video.where(['user_gallery_id = ?', user_gallery_id])
    puts videos.inspect
    unless  videos.blank? ||  videos.nil?
      videos.each do |video|
        puts video.user_id
        user = User.find(video.user_id)
        videotags =  video.tags.pluck([:name])
        video.taglist = videotags
        video.user_login = user.login
        #get comments
        video = get_comment_stuff(video)
        #get whirls
        video =  get_whirl_stuff(video)
        combined_videos << video
      end
    end
    return combined_videos
  end



end
