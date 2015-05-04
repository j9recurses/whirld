#https://github.com/stympy/faker

#require 'populator'
#require 'faker'


namespace :db do
  desc "fill database"
  task populate: :environment do


    [User, Map, Tag].each(&:delete_all)
    password = "password"
    User.populate 2 do | user|
      #user.name = Faker::Name.name
      user.encrypted_password = User.new(:password => password).encrypted_password
      user.email = Faker::Internet.email
      user.current_sign_in_ip = Faker::Internet.ip_v4_address
      user.last_sign_in_ip = Faker::Internet.ip_v4_address
      user.login = Faker::Internet.user_name
      user.sign_in_count = 3
      Map.populate 20 do | map |
        map.user_id = user.id
        map.name = Faker::Name.title
        map.lat = Faker::Address.latitude
        map.lon = Faker::Address.longitude
        map.created_at = 10.minutes.ago
        map.updated_at =  13.minutes.ago
        map.description = Faker::Lorem.paragraph
        map.author = user.login
        map.location  =  Faker::Address.city_prefix + " " + Faker::Address.city_suffix
        map.tiles = "google"
        map.tile_layer = "     "
        map.archived = 0
        map.vectors = 0
        map.coverphoto = 3
        map.slug = Faker::Internet.slug(map.name, '-')
        Tag.populate 10 do | tag |
          tag.name = Faker::Lorem.word
          tag.user_id = user.id
          tag.taggable_type = "Map"
          tag.taggable_id = map.id
        end
      end
    end
  end
end
