class UserGallery < ActiveRecord::Base
  attr_accessible :name, :map_id, :user_id
  belongs_to :map
  has_many :photos, :dependent => :destroy
  validates_presence_of :name
  validates_uniqueness_of :name
  has_one :photo_grid_order

  def at_least_one_photo?
    self.photos.present?
  end

end
