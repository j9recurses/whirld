class UserProfile < ActiveRecord::Base
  geocoded_by :address, :latitude  => :lat, :longitude => :lon

  attr_accessible :user_id, :location, :lat, :lon, :description, :first_name, :last_name
  belongs_to :users
  has_one :photo
  has_many :tags, :as => :taggable, dependent: :destroy
  validates_length_of       :first_name,     :maximum => 100
  validates_length_of       :last_name,     :maximum => 100
  #include PublicActivity::Model
  # tracked owner: Proc.new{ |controller, model| controller.current_user }

  def self.get_collaborators(maps)
    collaborators = Hash.new
    maps.each do |map|
      musers = map.users
       collaborators[map] = musers
      end
      return collaborators
    end


  def self.find_nearby_users(user_profile)
    unless user_profile.lat.blank? or user_profile.lon.blank?
      neighbors = UserProfile.near([user_profile.lat, user_profile.lon], 3000)
      neighbor_info = Array.new
      neighbors.each do | n|
        n.ndist = neighbor_distance(user_profile.lat, user_profile.lon, n.lat, n.lon)
        n.login = User.where(["id = ?", n.user_id]).pluck([:login]).first
        n.taglist = n.tags
        neighbor_info << n
      end
      return neighbor_info
    end
  end


def self.neighbor_distance(lat1, lon1, lat2, lon2)
    distance = Geocoder::Calculations.distance_between([lat1, lon1], [lat2, lon2])
    return distance
  end

  attr_accessor :taglist, :photos
  def taglist
    @taglist
  end

  def taglist=(val)
    @taglist = val
  end

  def login
    @login
  end

  def login=(val)
    @login = val
  end


 def ndist
    @ndist
  end

  def ndist=(val)
    @ndist = val
  end


end
