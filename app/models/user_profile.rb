class UserProfile < ActiveRecord::Base
  geocoded_by :address, :latitude  => :lat, :longitude => :lon
  mount_uploader :photo_file, UserProfileUploader
  attr_accessible :user_id, :location, :lat, :lon, :description, :first_name, :last_name, :photo_file
  belongs_to :users
  has_one :photo
  validates_length_of       :first_name,     :maximum => 100
  validates_length_of       :last_name,     :maximum => 100

  include PublicActivity::Model
  #tracked owner: Proc.new{ |controller, model| controller.current_user }

  def self.get_collaborators(maps)
    collaborators = Hash.new
    maps.each do |map|
      musers = Collaborator.where('map_id = ?', map.id).uniq.pluck(:user_id)
      collabos = Array.new
       musers.each do |m|
          colab = User.find(m)
          collabos << colab
        end
      collaborators[map] = collabos
      puts collaborators[map]
    end
    return collaborators
  end

  def self.get_collaborators_list(puser_id)
    collabo_list =find_by_sql( "select distinct u.* from   users u  join collaborators c on c.user_id = u.id where map_id in (
                              select map_id  from collaborators where user_id = #{puser_id}) and user_id != #{puser_id}")
    u_collabo_list = Array.new
    collabo_list.each do |c|
      u = User.find(c)
      u_collabo_list << u
    end
    return u_collabo_list
  end


  def lat_lon
    [lat, lon].join(',')
  end

  # <img src="/assets/test/cat.png" alt="profile_pic" style="width:120px;height:120px">
  #map_list.each do | map |
  #  user =
  def self.get_photo_gallery(user_id)
    user_photos = Photo.where(["user_id = ?" , user_id])
    #map_photos = Photo.where(["user_id = ? and is_aerial = true " , user_id])
    return user_photos
  end


  def self.find_nearby_users(user_profile)
    unless user_profile.lat.blank? or user_profile.lon.blank?
      neighbors = UserProfile.near([user_profile.lat, user_profile.lon], 3000)
      neighbor_info = Array.new
      neighbors.each do | n|
        n.ndist = neighbor_distance(user_profile.lat, user_profile.lon, n.lat, n.lon)
        n.login = User.where(["id = ?", n.user_id]).pluck([:login]).first
        n.taglist = User.where(["id = ?", n.user_id]).first.tags
        neighbor_info << n
      end
      return neighbor_info
    end
  end


  def self.neighbor_distance(lat1, lon1, lat2, lon2)
    distance = Geocoder::Calculations.distance_between([lat1, lon1], [lat2, lon2])
    return distance
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

    def taglist
    @taglist
  end
  def taglist=(val)
    @taglist = val
  end

end


