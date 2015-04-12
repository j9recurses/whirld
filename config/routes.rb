Whirld::Application.routes.draw do

  # redirect legacy route:
  get 'tag/:id', to: redirect('/tags/%{id}')
  get 'tags/:id' => 'tags#show'

  # Registered user pages:
  get 'profile' => 'users#profile', :id => 0
  get 'profile/:id' => 'users#profile'
  get 'dashboard' => 'users#dashboard'

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
  get 'search' => 'maps#search'
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
  get 'maps/:id' => 'maps#show'
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

  # You can have the root of your site routed with 'root'
  # just remember to delete public/index.html.
  root :to => 'maps#index'

  # See how all your routes lay out with 'rake routes'

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  get ':controller/:action'
  get ':controller/:action/:id'
  get ':controller/:action.:format'
  get ':controller/:action/:id.:format'

  get 'tags/:tag', to: 'maps#index', as: :tag


  # RESTful API
  resources :maps do
    resources :tags
    resources :comments
    resources :warpables
    resources :annotations
  end
  devise_for :users
  #, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  post '/videos/videos_get_upload_token', to: 'videos#videos_get_upload_token', as: :videos_get_upload_token
  get '/videos/get_video_uid', to: 'videos#get_video_uid', as: :get_video_uid


  get '/auth/:provider/callback', to: 'sessions#youtube_create'
  get '/auth/failure', to: 'sessions#fail'
  resources :videos, only: [:new, :index]

  match "videos/:id/add_comment", :to => "videos#add_comment"
end
