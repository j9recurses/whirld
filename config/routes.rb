Whirld::Application.routes.draw do


  # RESTful API


  get 'feeds/all' => 'feeds#all', :format => 'rss'
  get 'feeds/license/:id' => 'feeds#license', :format => 'rss'
  get 'feeds/author/:id' => 'feeds#author', :format => 'rss'

  get 'tms/:id/alt/:z/:x/:y.png' => 'utility#tms_alt'
  get 'tms/:id/' => 'utility#tms_info'
  get 'tms/:id/alt/' => 'utility#tms_info'

  # once we have string-based ids, reorganize these around 'maps' and resourceful routing
  get 'maps' => 'maps#index'
  post 'maps' => 'maps#create' # legacy, will be replaced by resourceful route
  put 'map/:id' => 'maps#update' # legacy, will be replaced by resourceful route
  get 'search/:id' => 'maps#search'
  get 'map/update/:id' => 'maps#update' # legacy
  get 'map/region/:id' => 'maps#region'
  get 'map/license/:id' => 'maps#license'
  get 'map/view/:id' => 'maps#view' # legacy
  get 'maps/new' => 'maps#new' # legacy, will be replaced by resourceful route
  get 'maps/:id/edit' => 'maps#edit' # legacy, will be replaced by resourceful route
  get 'maps/:id/annotate' => 'maps#annotate'
  get 'maps/exports/:id' => 'maps#exports'
  get 'maps/:id/warpables' => 'maps#images' # deprecate this in favor of resourceful route below; this is just to override maps/:id
  post 'maps/:map_id/warpables' => 'images#create' # deprecate this in favor of resourceful route below; this is just to override maps/:id
  get 'export/progress/:id' => 'export#progress'
  #get 'maps/:id' => 'maps#show' , as: :map
  get 'map/:id', to: redirect('/maps/%{id}')
  get 'embed/:id' => 'maps#embed'
  post 'maps/export/:id' => 'maps#export'
  post 'maps/:id' => 'maps#export'

  get 'import/:name' => 'images#import' # this was for auto-adding images via URL
  post 'export/:action/:id' => 'export'

  # make these resourceful after renaming warpables to images
  post 'images/create/:id' => 'images#create' # used?
  post 'warper/update' => 'images#update' # legacy for cartagen.js
  post 'images/update' => 'images#update'
  post 'images/delete/:id' => 'images#delete'
  delete 'maps/:map_id/warpables/:id' => 'images#destroy' #legacy, will be resourceful
  delete 'images/:id' => 'images#destroy' #legacy, will be resourceful


  resources :maps do
    resources :warpables
    resources :annotations
  end
  # You can have the root of your site routed with 'root'
  # just remember to delete public/index.html.
  root :to => 'projects#show'
  get 'new' => 'projects#new'

  # See how all your routes lay out with 'rake routes'

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  get ':controller/:action'
  get ':controller/:action/:id'
  get ':controller/:action.:format'
  get ':controller/:action/:id.:format'

  get 'tags/:tag', to: 'maps#index', as: :tag


  devise_for :users do
    resources :user_profiles
  end
  #, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  post '/videos/videos_get_upload_token', to: 'videos#videos_get_upload_token', as: :videos_get_upload_token
  get '/videos/get_video_uid', to: 'videos#get_video_uid', as: :get_video_uid


  get '/auth/:provider/callback', to: 'sessions#youtube_create'
  get '/auth/failure', to: 'sessions#fail'
  resources :videos, only: [:new, :index]

  #get 'maps/about',  to: 'maps#about',  :as => :maps_about_path


  match "videos/:id/add_comment", :to => "videos#add_comment"
  get 'maps/map_info/:id', to: 'maps#map_info',  :as => :map_info
  put 'maps/map_info_finish/:id',  to: 'maps#map_info_finish',  :as => :map_info_finish

  post '/maps/update_remote/:id/' =>'maps#update_remote', :as => :map_update_remote, :defaults => {:format => 'json' }

  # module orders
  # post 'photo_mods/mod_order/:id...id is Map id. params are '

  #project module routes
  #photo mods
  post 'photo_mods/place_mod_photo', :to => 'photo_mods#place_mod_photo', :as => 'place_mod_photo'
  delete 'photo_mods/remove_mod_photo/:id', :to => 'photo_mods#remove_mod_photo', :as => 'remove_mod_photo'

  #gallery split
  delete 'photo_mods/user_gallery_split_delete/:id', :to => 'photo_mods#user_gallery_split_delete', :as => 'user_gallery_split_delete'
  put 'photo_mods/user_gallery_split_update/:id', :to => 'photo_mods#user_gallery_split_update', :as => 'user_gallery_split_update'
  post 'photo_mods/user_gallery_split_create/:id', :to => 'photo_mods#user_gallery_split_create', :as => 'user_gallery_split_create'

  #gallery comparison
  delete 'photo_mods/user_gallery_comparison_delete/:id', :to => 'photo_mods#user_gallery_comparison_delete', :as => 'user_gallery_comparison_delete'
  put 'photo_mods/user_gallery_comparison_update/:id', :to => 'photo_mods#user_gallery_comparison_update', :as => 'user_gallery_comparison_update'
  post 'photo_mods/user_gallery_comparison_create/:id', :to => 'photo_mods#user_gallery_comparison_create', :as => 'user_gallery_comparison_create'

  #grid
  delete 'photo_mods/user_gallery_grid_delete/:id', :to => 'photo_mods#user_gallery_grid_delete', :as => 'user_gallery_grid_delete'
  put 'photo_mods/user_gallery_grid_update/:id', :to => 'photo_mods#user_gallery_grid_update', :as => 'user_gallery_grid_update'
  post 'photo_mods/user_gallery_grid_create/:id', :to  => 'photo_mods#user_gallery_grid_create', :as => 'user_gallery_grid_create'

  #bloc_text
  delete 'photo_mods/user_gallery_text_delete/:id', :to => 'photo_mods#user_gallery_text_delete', :as => 'user_gallery_text_delete'
  put 'photo_mods/user_gallery_text_update/:id', :to => 'photo_mods#user_gallery_text_update', :as => 'user_gallery_text_update'
  post 'photo_mods/user_gallery_text_create/:id', :to  => 'photo_mods#user_gallery_text_create', :as => 'user_gallery_text_create'

  #taggings
  post 'photo_mods/create_taggings', :to => 'photo_mods#create_taggings', :as => 'create_taggings'
  delete 'photo_mods/delete_taggings/:id', :to => 'photo_mods#delete_taggings', :as => 'delete_taggings'

  #video
  post 'photo_mods/user_gallery_video_create/:id', :to => 'photo_mods#user_gallery_video_create'
  delete 'photo_mods/user_gallery_video_delete/:id', :to => 'photo_mods#user_gallery_video_delete',  :as => 'user_gallery_video_delete'
  put 'photo_mods/user_gallery_video_update/:id', :to => 'photo_mods#user_gallery_video_update', :as => 'user_gallery_video_update'

  #user profiles
  get 'users_profiles/:id' => 'user_profiles#show', :as => "user_profile"
  get 'users_profiles_edit/:id' => 'user_profiles#edit', :as => "user_profile_edit"
  put 'users/:id/user_profiles_update/:id' => 'user_profiles#update', :as => "user_user_profile"

  #search
  post 'search' => 'maps#search'
  get 'search' => 'maps#search'

  #search from nav bar
  get 'search_top_navbar' => 'maps#search_top_navbar'

  #autocomplete results
  get 'autocomplete' => 'maps#autocomplete'

  #user galleries
  resources :user_galleries do
    resources :photos, :except => [:update, :edit]
  end

  #whirls
  post 'whirl' => 'whirls#whirl',  :as => "whirl_path"
  post 'unwhirl' => 'whirls#unwhirl',  :as => "unwhirl_path"


  #comments
  post 'comment' => "comments#comment" ,  :as => "comment_path"
  post 'threaded_comment' => "comments#threaded_comment" ,  :as => "threaded_comment_path"
  put  'edit_comment/:id'  => "comments#edit_comment" ,  :as => "edit_comment_path"
  delete  'delete_comment/:id'  => "comments#delete_comment" ,  :as => "delete_comment_path"

  #map cover photo
  post  '/coverphoto_uploader/:id'  => "maps#coverphoto_uploader" ,  :as => "coverphoto_uploader_path"


end
