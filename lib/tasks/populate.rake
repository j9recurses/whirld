# #https://github.com/stympy/faker


require 'populator'
require 'faker'
#
#
def make_tags(id, type, user_id)
  Tag.populate 10 do |tag|
    tag.name = Faker::Commerce.color
    tag.taggable_id = id
    tag.taggable_type = type
    tag.user_id = user_id
  end
end


def make_comments(id, type, user_id, user_login)
  Comment.populate 5 do | comment|
    comment.body = Faker::Lorem.sentence(word_count = 20, supplemental = false, random_words_to_add = 10)
    comment.commentable_id = id
    comment.commentable_type = type
    comment.user_id = user_id
    comment.created_at = 11.minutes.ago
    comment.user_login = user_login
  end
end

namespace :db do
  desc "fill database"
  task populate: :environment do
    # Map, Tag, Vote, Collaborator, Comment, PhotoMod, Photo, UserGallery, UserGalleryGrid,
    [User, UserProfile, Map, UserGallery, Tag].each(&:delete_all)
    password = "password"
    #####user######
    User.populate 5 do | user|
      user.encrypted_password = User.new(:password => password).encrypted_password
      user.email = Faker::Internet.email
      user.current_sign_in_ip = Faker::Internet.ip_v4_address
      user.last_sign_in_ip = Faker::Internet.ip_v4_address
      user.login = Faker::Internet.user_name
      user.sign_in_count = 3
      make_tags(user.id, "User", user.id)
      #####user profile#######
      UserProfile.populate 1 do |up |
        up.location =  Faker::Address.city_prefix + " " + Faker::Address.city_suffix
        up.lat = Faker::Address.latitude
        up.lon = Faker::Address.longitude
        up.description = Faker::Lorem.sentence(word_count = 20, supplemental = false, random_words_to_add = 10)
        up.first_name  = Faker::Internet.user_name
        up.last_name  = Faker::Internet.user_name
        up.user_id = user.id
      end
      #####map#######
      Map.populate 3 do | map |
        map.user_id = user.id
        map.name = Faker::Lorem.word+Faker::Commerce.color
        map.lat = Faker::Address.latitude
        map.lon = Faker::Address.longitude
        map.created_at = 13.minutes.ago
        map.updated_at =  10.minutes.ago
        map.description = Faker::Lorem.sentence(word_count = 20, supplemental = false, random_words_to_add = 10)
        map.location  =  Faker::Address.city_prefix + " " + Faker::Address.city_suffix
        map.tiles = "google"
        map.tile_layer = "     "
        map.archived = 0
        map.vectors = 0
        map.coverphoto = 3
        map.slug = Faker::Lorem.word+Faker::Commerce.color
        map.finished = 0
        map.finished_dt =  1.minutes.ago
        ###map tags#####
        make_tags(map.id, "Map", user.id)
        make_comments(map.id, "Map", user.id, user.login)
        ###user gallery#####
        UserGallery.populate 2 do | ug |
          ug.map_id = map.id
          ug.user_id = user.id
          #####user split#######
          UserGallerySplit.populate 3 do | split|
            split.user_gallery_id = ug.id
            split.split_text = Faker::Lorem.sentence(word_count = 20, supplemental = false, random_words_to_add = 10)
            make_tags(split.id, "UserGallerySplit", user.id)
            make_comments(split.id,"UserGallerySplit", user.id, user.login)
            #####user block text#######
            UserGalleryBlocText.populate 3 do | split|
              split.user_gallery_id = ug.id
              split.bloc_text = Faker::Lorem.sentence(word_count = 20, supplemental = false, random_words_to_add = 10)
              make_tags(split.id, "UserGalleryBlocText", user.id)
              make_comments(split.id,"UserGalleryBlocText", user.id, user.login)
            end
            #####user grid#####
            UserGalleryGrid.populate 3 do | split|
              split.user_gallery_id = ug.id
              split.grid_text = Faker::Lorem.sentence(word_count = 20, supplemental = false, random_words_to_add = 10)
              make_tags(split.id, "UserGalleryGrid", user.id)
              make_comments(split.id,"UserGalleryGrid", user.id, user.login)
            end
            #####user comparison#####
            UserGalleryComparison.populate 3 do | split|
              split.user_gallery_id = ug.id
              split.comparison_text = Faker::Lorem.sentence(word_count = 20, supplemental = false, random_words_to_add = 10)
              make_tags(split.id, "UserGalleryComparison", user.id)
              make_comments(split.id,"UserGalleryComparison", user.id, user.login)
            end
          end
        end
      end
    end
  end
end
