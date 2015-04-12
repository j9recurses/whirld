class UserGallery < ActiveRecord::Base
  attr_accessible :name
  belongs_to :user
  has_many :photos, :dependent => :destroy
  validates_presence_of :name
  validates_uniqueness_of :name

  def at_least_one_photo?
    self.photos.present?
  end

end
