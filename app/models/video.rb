class Video < ActiveRecord::Base
  belongs_to :user
  belongs_to :user_gallery
  has_many :tags, :as => :taggable, dependent: :destroy
  acts_as_votable
  acts_as_commentable
  attr_accessible :link, :map_id, :title, :user_id, :youtube_user_id, :vid_date, :vid_time, :description, :user_gallery_id
  attr_accessor  :taglist, :user_login, :photos, :user_whirled, :comment_cnt, :comments


end
