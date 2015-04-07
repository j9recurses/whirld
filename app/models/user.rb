require 'digest/sha1'

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  #       :omniauthable, :omniauth_providers => [:google_oauth2]


  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :login, :name
  # Include default devise modules. Others available are:
  # :token_authenticatable, :lockable, :timeoutable and :activatable

  has_many :maps
  has_many :tags
  has_many :comments
  has_many :exports
  has_many :videos

  validates_presence_of     :login
  validates_length_of       :login,    :within => 3..40
  validates_uniqueness_of   :login
  validates_length_of       :name,     :maximum => 100

  validates_presence_of     :email
  validates_length_of       :email,    :within => 6..100 #r@a.wk
  validates_uniqueness_of   :email



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


  def owns?(resource)
    resource.user_id.to_i == self.id
  end

  def owns_map?(resource)
    resource.respond_to?(:map) && resource.map.user_id.to_i == self.id
  end

  def can_delete?(resource)
    self.owns?(resource) || self.owns_map?(resource) || self.role == "admin"
  end

  def can_edit?(resource)
    self.owns?(resource)
  end



end
