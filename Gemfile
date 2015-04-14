source "https://rubygems.org"

ruby "2.1.2"
gem "rails", "~>3.2.3"

gem "will_paginate", "3.0.7"
gem "will_paginate-bootstrap"
gem "friendly_id"

gem "omniauth-google-oauth2"
gem 'youtube_it', github: 'bodrovis/youtube_it'
gem 'acts_as_commentable', '3.0.1'
gem 'acts-as-taggable-on', '~> 3.4'

# dependencies
group :dependencies do
  gem "mysql", "2.9.1"
  gem "mysql2"
  gem "geokit-rails", "1.1.4"
  gem "image_science", "1.2.6"
  gem "recaptcha", "0.3.6", :require => "recaptcha/rails"
  gem "oa-openid", "0.3.2"
  gem "ruby-openid", "~>2.5"
  gem "open_id_authentication"
  gem "RubyInline"
  gem "paperclip", "~>4.2.0"

  # if you use amazon s3 for warpable image storage
  gem 'aws-sdk', '~> 1.5.7'

  # for rake image migration tasks
  gem 'right_aws'

  # compiling markdown to html
  gem "rdiscount", "2.1.7.1"

  # asset pipelining
  gem "sprockets"#, "2.12.1"
  gem 'sass-rails',   '~> 3.2.3'
  gem "autoprefixer-rails"
  gem 'uglifier', '>= 1.0.3'
end

group :development do
  gem "jshintrb"
  gem "therubyracer"
end



group :passenger do
  # passenger server
  gem "passenger"
end

gem 'devise'

gem 'jquery-rails'
gem 'turbolinks'
gem 'jquery-turbolinks'
gem "carrierwave", "~> 0.6.2"
gem "mini_magick", "~> 3.4"
gem 'jbuilder'
