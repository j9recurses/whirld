#https://github.com/stympy/faker

#require 'populator'
#require 'faker'


namespace :db do
  desc "fill database"
  task populate: :environment do
    counter = 0
    # Map, Tag, Vote, Collaborator, Comment, PhotoMod, Photo, UserGallery, UserGalleryGrid,
    [User,.each(&:delete_all)
    password = "password"
    User.populate 10 do | user|
      user.encrypted_password = User.new(:password => password).encrypted_password
      user.email = Faker::Internet.email
      user.current_sign_in_ip = Faker::Internet.ip_v4_address
      user.last_sign_in_ip = Faker::Internet.ip_v4_address
      user.login = Faker::Internet.user_name
      user.sign_in_count = 3
     end
     Users.all.each do | user|
        user.profiles.location =  Faker::Address.city_prefix + " " + Faker::Address.city_suffix
        user.profiles.lat = Faker::Address.latitude
        user.profiles.lon = Faker::Address.longitude
        user.profiles.description = Faker::Lorem.sentence(word_count = 20, supplemental = false, random_words_to_add = 10)
        user.profiles.first_name  = Faker::Internet.user_name
        user.profiles.last_name  = Faker::Internet.user_name
        user.profiles.user_id = user.id
      end
      #    # File.open(Dir.glob(File.join(Rails.root, "app", "assets", "images", "test", '*')).sample)
      #   #make a map
      #   Map.populate 1 do | map |
      #     map.user_id = user.id
      #     map.name = Faker::Lorem.word
      #     map.lat = Faker::Address.latitude
      #     map.lon = Faker::Address.longitude
      #     map.created_at = 13.minutes.ago
      #     map.updated_at =  10.minutes.ago
      #     map.description = Faker::Lorem.sentence(word_count = 20, supplemental = false, random_words_to_add = 10)
      #     map.location  =  Faker::Address.city_prefix + " " + Faker::Address.city_suffix
      #     map.tiles = "google"
      #     map.tile_layer = "     "
      #     map.archived = 0
      #     map.vectors = 0
      #     map.coverphoto = 3
      #     map.slug = map.name + 0.to_s
      #     map.finished = 0
      #     counter = counter + 1
      #     map.finished_dt =  1.minutes.ago
      #     UserGallery.populate 1 do | ug |
      #       ug.map_id = map.id
      #       ug.user_id = user.id
      #       #make a map cover photo
      #       Photo.populate 1 do |photo|
      #         photo.photo_file = up.photo_file = File.open(File.join(Rails.root, "app", "assets", "images", "test", "teagarden.jpg"))
      #         PhotoMod.populate 1 do |ph|
      #           ph.mod_gallery_id = ug.id
      #           ph.mod_gallery_type = "Map"
      #           ph.caption = Faker::Lorem.sentence
      #           ph.photo_id = photo.id
      #           map.coverphoto = photo.id
      #         end
      #         #hoto.photo_file = up.photo_file = File.open(File.join(Rails.root, "app", "assets", "images", "test", "teagarden.jpg"))
      #       end
      #       Tag.populate 10 do | tag |
      #         tag.name = Faker::Lorem.word
      #         tag.user_id = user.id
      #         tag.taggable_type = "Map"
      #         tag.taggable_id = map.id
      #       end
      #       Tag.populate 10 do | tag |
      #         tag.name = Faker::Lorem.word
      #         tag.user_id = user.id
      #         tag.taggable_type = "UserProfile"
      #         tag.taggable_id = up.id
      #       end
      #     end
      #    # map.id
      #    # votable_type = "Map"
      #    # voter_id = user.id,
      #   #  votable_id = map.id
      #   end
      # end
    end
  end    # Comment.populate 3 do | comment|
end

