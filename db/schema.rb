# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20150508075438) do

  create_table "activities", :force => true do |t|
    t.integer  "trackable_id"
    t.string   "trackable_type"
    t.integer  "owner_id"
    t.string   "owner_type"
    t.string   "key"
    t.text     "parameters"
    t.integer  "recipient_id"
    t.string   "recipient_type"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  add_index "activities", ["owner_id", "owner_type"], :name => "index_activities_on_owner_id_and_owner_type"
  add_index "activities", ["recipient_id", "recipient_type"], :name => "index_activities_on_recipient_id_and_recipient_type"
  add_index "activities", ["trackable_id", "trackable_type"], :name => "index_activities_on_trackable_id_and_trackable_type"

  create_table "annotations", :force => true do |t|
    t.integer  "map_id"
    t.integer  "user_id"
    t.string   "annotation_type"
    t.string   "text"
    t.string   "style"
    t.string   "coordinates"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  create_table "collaborators", :force => true do |t|
    t.integer "user_id"
    t.integer "map_id"
  end

  add_index "collaborators", ["map_id"], :name => "index_collaborators_on_map_id"
  add_index "collaborators", ["user_id"], :name => "index_collaborators_on_user_id"

  create_table "comments", :force => true do |t|
    t.integer  "commentable_id",   :default => 0
    t.string   "commentable_type"
    t.string   "title"
    t.text     "body"
    t.string   "subject"
    t.integer  "user_id",          :default => 0, :null => false
    t.integer  "parent_id"
    t.integer  "lft"
    t.integer  "rgt"
    t.datetime "created_at",                      :null => false
    t.datetime "updated_at",                      :null => false
    t.string   "user_login"
  end

  add_index "comments", ["commentable_id", "commentable_type"], :name => "index_comments_on_commentable_id_and_commentable_type"
  add_index "comments", ["user_id"], :name => "index_comments_on_user_id"

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0, :null => false
    t.integer  "attempts",   :default => 0, :null => false
    t.text     "handler",                   :null => false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "exports", :force => true do |t|
    t.integer  "map_id",       :default => 0
    t.integer  "size",         :default => 0
    t.integer  "width",        :default => 0
    t.integer  "height",       :default => 0
    t.float    "cm_per_pixel", :default => 0.0
    t.string   "status",       :default => "none"
    t.boolean  "tms",          :default => false
    t.boolean  "jpg",          :default => false
    t.boolean  "geotiff",      :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "zip",          :default => false,    :null => false
    t.text     "bands_string",                       :null => false
    t.string   "export_type",  :default => "normal", :null => false
    t.integer  "user_id",      :default => 0
  end

  create_table "friendly_id_slugs", :force => true do |t|
    t.string   "slug",                         :null => false
    t.integer  "sluggable_id",                 :null => false
    t.string   "sluggable_type", :limit => 40
    t.datetime "created_at"
  end

  add_index "friendly_id_slugs", ["slug", "sluggable_type"], :name => "index_friendly_id_slugs_on_slug_and_sluggable_type", :unique => true
  add_index "friendly_id_slugs", ["sluggable_id"], :name => "index_friendly_id_slugs_on_sluggable_id"
  add_index "friendly_id_slugs", ["sluggable_type"], :name => "index_friendly_id_slugs_on_sluggable_type"

  create_table "maps", :force => true do |t|
    t.string   "name",                                             :default => ""
    t.decimal  "lat",              :precision => 20, :scale => 10, :default => 0.0
    t.decimal  "lon",              :precision => 20, :scale => 10, :default => 0.0
    t.integer  "version",                                          :default => 1
    t.string   "password",                                         :default => ""
    t.text     "styles"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "description"
    t.string   "author",                                           :default => "anonymous"
    t.decimal  "zoom",             :precision => 15, :scale => 10, :default => 2.0
    t.string   "location",                                         :default => ""
    t.string   "static_data",                                      :default => ""
    t.boolean  "vectors",                                          :default => false,       :null => false
    t.string   "tiles",                                            :default => "google",    :null => false
    t.boolean  "archived",                                         :default => false,       :null => false
    t.text     "tile_layer",                                                                :null => false
    t.string   "license",                                          :default => "copyright"
    t.integer  "user_id",                                          :default => 0
    t.boolean  "anon_annotatable",                                 :default => false
    t.string   "slug"
    t.boolean  "finished",                                         :default => true
    t.integer  "coverphoto"
    t.text     "tile_url"
    t.datetime "finished_dt"
  end

  add_index "maps", ["slug"], :name => "index_maps_on_slug", :unique => true

  create_table "nodes", :force => true do |t|
    t.string   "color",                                       :default => "red"
    t.string   "author",                                      :default => "anonymous"
    t.decimal  "lat",         :precision => 20, :scale => 10, :default => 0.0
    t.decimal  "lon",         :precision => 20, :scale => 10, :default => 0.0
    t.integer  "way_id",                                      :default => 0
    t.integer  "order",                                       :default => 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name",                                        :default => ""
    t.string   "description",                                 :default => ""
    t.integer  "map_id",                                      :default => 0
    t.integer  "way_order",                                   :default => 0
    t.text     "body"
  end

  create_table "photo_mods", :force => true do |t|
    t.integer "photo_id"
    t.text    "caption"
    t.integer "mod_gallery_id"
    t.string  "mod_gallery_type"
  end

  add_index "photo_mods", ["mod_gallery_id", "mod_gallery_type"], :name => "index_photo_mods_on_mod_gallery_and_mod_type"

  create_table "photos", :force => true do |t|
    t.integer  "user_gallery_id"
    t.string   "photo_file"
    t.datetime "created_at",                            :null => false
    t.datetime "updated_at",                            :null => false
    t.boolean  "is_aerial",          :default => false
    t.boolean  "is_normal",          :default => false
    t.integer  "width"
    t.integer  "height"
    t.string   "content_type"
    t.integer  "file_size"
    t.integer  "warpable_id"
    t.string   "warpable_url"
    t.string   "warpable_thumb_url"
    t.integer  "user_id"
  end

  create_table "taggings", :force => true do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.integer  "tagger_id"
    t.string   "tagger_type"
    t.string   "context",       :limit => 128
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], :name => "taggings_idx", :unique => true
  add_index "taggings", ["taggable_id", "taggable_type", "context"], :name => "index_taggings_on_taggable_id_and_taggable_type_and_context"

  create_table "tags", :force => true do |t|
    t.string   "name"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.integer  "user_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "user_galleries", :force => true do |t|
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.integer  "map_id"
    t.string   "module_order"
  end

  create_table "user_gallery_bloc_texts", :force => true do |t|
    t.integer "user_gallery_id"
    t.text    "bloc_text"
  end

  create_table "user_gallery_comparisons", :force => true do |t|
    t.integer  "user_gallery_id"
    t.string   "comparison_photo_order"
    t.datetime "created_at",             :null => false
    t.datetime "updated_at",             :null => false
  end

  create_table "user_gallery_grids", :force => true do |t|
    t.integer  "user_gallery_id"
    t.string   "grid_photo_order"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "user_gallery_splits", :force => true do |t|
    t.integer  "user_gallery_id"
    t.text     "split_text"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
  end

  create_table "user_profiles", :force => true do |t|
    t.integer "user_id"
    t.string  "location"
    t.decimal "lat",         :precision => 20, :scale => 10, :default => 0.0
    t.decimal "lon",         :precision => 20, :scale => 10, :default => 0.0
    t.text    "description"
    t.string  "first_name"
    t.string  "last_name"
    t.string  "photo_file"
  end

  add_index "user_profiles", ["user_id"], :name => "index_user_profiles_on_user_id", :unique => true

  create_table "users", :force => true do |t|
    t.string   "email",                                :default => "", :null => false
    t.string   "encrypted_password",                   :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                        :default => 0,  :null => false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "login",                  :limit => 40
    t.string   "provider"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "videos", :force => true do |t|
    t.string   "link"
    t.string   "title"
    t.string   "author"
    t.string   "duration"
    t.integer  "likes"
    t.integer  "dislikes"
    t.date     "vid_date"
    t.time     "vid_time"
    t.integer  "user_id"
    t.integer  "map_id"
    t.string   "description"
    t.string   "yt_video_id"
    t.boolean  "is_complete", :default => false
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
    t.string   "uid"
  end

  add_index "videos", ["map_id"], :name => "index_videos_on_map_id"
  add_index "videos", ["user_id"], :name => "index_videos_on_user_id"

  create_table "votes", :force => true do |t|
    t.integer  "votable_id"
    t.string   "votable_type"
    t.integer  "voter_id"
    t.string   "voter_type"
    t.boolean  "vote_flag"
    t.string   "vote_scope"
    t.integer  "vote_weight"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  add_index "votes", ["votable_id", "votable_type", "vote_scope"], :name => "index_votes_on_votable_id_and_votable_type_and_vote_scope"
  add_index "votes", ["votable_id", "votable_type"], :name => "index_votes_on_votable_id_and_votable_type"
  add_index "votes", ["voter_id", "voter_type", "vote_scope"], :name => "index_votes_on_voter_id_and_voter_type_and_vote_scope"
  add_index "votes", ["voter_id", "voter_type"], :name => "index_votes_on_voter_id_and_voter_type"

  create_table "warpables", :force => true do |t|
    t.integer  "parent_id"
    t.string   "image_content_type"
    t.string   "image_file_name"
    t.string   "thumbnail"
    t.integer  "image_file_size"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "map_id",             :default => 0
    t.string   "nodes",              :default => ""
    t.boolean  "locked",             :default => false, :null => false
    t.boolean  "deleted",            :default => false, :null => false
    t.text     "history",                               :null => false
    t.float    "cm_per_pixel",       :default => 0.0,   :null => false
  end

  create_table "ways", :force => true do |t|
    t.string   "color",                                       :default => "red"
    t.string   "author",                                      :default => "anonymous"
    t.decimal  "lat1",        :precision => 20, :scale => 10, :default => 0.0
    t.decimal  "lat2",        :precision => 20, :scale => 10, :default => 0.0
    t.decimal  "lon1",        :precision => 20, :scale => 10, :default => 0.0
    t.decimal  "lon2",        :precision => 20, :scale => 10, :default => 0.0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name",                                        :default => ""
    t.string   "description",                                 :default => ""
    t.boolean  "complete",                                    :default => true
    t.integer  "map_id",                                      :default => 0
    t.text     "body"
  end

  create_table "youtube_users", :force => true do |t|
    t.string   "youtube_name"
    t.string   "token"
    t.string   "uid"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
