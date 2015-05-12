class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  #       :omniauthable, :omniauth_providers => [:google_oauth2]


  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :login, :user_profile_attributes, :encrypted_password
  # Include default devise modules. Others available are:
  # :token_authenticatable, :lockable, :timeoutable and :activatable
  has_many :collaborators
  has_many :maps, through: :collaborators, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :exports, dependent: :destroy
  has_many :videos, dependent: :destroy
  has_many :youtube_users
  has_one :user_profile
  has_many :tags, :as => :taggable, dependent: :destroy
  has_many :user_gallery_grids,  dependent: :destroy
  has_many :user_gallery_splits,  dependent: :destroy
  has_many :user_gallery_bloc_texts,  dependent: :destroy
 has_many :user_gallery_comparisons,  dependent: :destroy


  #recommends :maps, :photos, :comments, :user_gallery_grids
  # acts_as_messageable

  accepts_nested_attributes_for :user_profile

  validates_presence_of     :login
  validates_length_of       :login,    :within => 3..40
  validates_uniqueness_of   :login

  validates_presence_of     :email
  validates_length_of       :email,    :within => 6..100 #r@a.wk
  validates_uniqueness_of   :email


include Tire::Model::Search
  include Tire::Model::Callbacks

  #FOR SEARCH
  after_touch() { tire.update_index }

  #set the search units for tire
  SEARCH_UNIT   = "mi"
  SEARCH_RADIUS = "300mi"
  SEARCH_ORDER  = "asc"

  tire do
    settings analysis: {
      filter: {
        ngram_filter: {
          type: 'nGram',
          min_gram: 2,
          max_gram: 12
        }
      },
      analyzer: {
        index_ngram_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase', 'ngram_filter']
        },
        search_ngram_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase']
        }
      }
    } do
      mapping do
        indexes :login, type: 'string', index_analyzer: "index_ngram_analyzer", search_analyzer: "search_ngram_analyzer", boost: 50
        indexes :description,   type: 'string', analyzer: 'snowball'
        indexes :id, :index    => :not_analyzed
      end

      indexes :tags do
        indexes :name, index_analyzer: "index_ngram_analyzer", search_analyzer: "search_ngram_analyzer"
      end

      indexes :user_profiles do
        indexes :lat_lon, type: 'geo_point'
      end
    end

  end



  def to_indexed_json
    # to_json(only: ['name', 'description'], methods: ['lat_lon'])
    to_json(:include => [:tags], :methods => [:lat_lon])
  end

  def self.simple_search(params)
    unless params[:location].blank?
      point  = self.get_search_cords(params[:location])
      unless params[:query].blank?
        s = Tire.search('users') { query { match [:name, :description, :name],  params[:query]  } }
      else
        s = Tire.search('users') { query { all } }
      end
      s. filter :geo_distance, lat_lon: point, distance: '300km'
      s.sort {  by "_geo_distance", {
                  "lat_lon" => point,
                  "order"       => SEARCH_ORDER,
                  "unit"        => SEARCH_UNIT
                }
                }
      results = s.results
    else
      results = Map.search do
        query { match [:name, :description, :name],  params[:query] }
      end
    end
    #puts results.inspect
    return results
  end


  def self.get_search_cords(location)
    geo = Geocoder.coordinates(location)
    point = "#{geo[0]}, #{geo[1]}"
    return point
  end



 def self.find_for_google_oauth2(access_token, signed_in_resource=nil)
    data = access_token.info
    user = User.where(:email => data["email"]).first
    return user if user
    # Uncomment the section below if you want users to be created if they don't exist
    unless user
        user = User.create(name: data["name"],
            email: data["email"],
           password: Devise.friendly_token[0,20]
         )
     end
  end


  def taglist
    @taglist
  end
  def taglist=(val)
    @taglist = val
  end


  def owns?(resource)
    resource.user_id.to_i == self.id
  end

  def owns_map?(resource)
    resource.respond_to?(:map) && resource.map.user_id.to_i == self.id
  end

  def can_delete?(resource)
    puts "******"
    puts resource
    self.owns?(resource) || self.owns_map?(resource) || self.role == "admin"
  end

  def can_edit?(resource)
    self.owns?(resource)
  end



end
