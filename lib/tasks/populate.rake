#https://github.com/stympy/faker

require 'populator'
require 'faker'


namespace :db do
  desc "fill database"
  task populate: :environment do


    # [Category, Product, Person].each(&:delete_all)
    User.populate 20 do | user|
      user.name = Faker::Name.name
      user.email = Faker::Internet.email
      user.current_sign_in_ip = Faker::Internet.ip_v4_address
      user.last_sign_in_ip = Faker::Internet.ip_v4_address
      user.login = Faker::Internet.user_name
      Map.populate 20 do | map |
        map.user_id = user.id
        map.name = Faker::Name.title
        map.lat = Faker::Address.latitude
        map.lon = Faker::Address.longitude
        map.created_at = Time.now.strftime("%m/%d/%Y")
        map.updated_at = Time.now.strftime("%m/%d/%Y")
        map.description = Faker::Lorem.paragraph
        map.author = user.login
        map.location  =  Faker::Address.city_prefix + " " + Faker::Address.city_suffix
        map.tiles = "google"
        Tag.populate 10 do | tag |
          tag.name =
            tag.user_id = user.id
          tag.taggable_type = "Map"
          tag.taggable_id = map.id
        end
      end
    end
  end
end
