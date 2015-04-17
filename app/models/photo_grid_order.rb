class PhotoOrderGrid < ActiveRecord::Base
  serialize :grid_order
  serialize :compare_order
  attr_accessible :grid_order, :gallery_id, :compare_order
  belongs_to :user_gallery
end
