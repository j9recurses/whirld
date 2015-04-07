class Video < ActiveRecord::Base
  belongs_to :user
  acts_as_commentable
  attr_accessible :link, :map_id, :title, :user_id, :vid_date, :vid_time, :description
  attr_accessor :comment


end
