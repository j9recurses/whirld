# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

Rails.application.config.assets.precompile += %w( stickyNavbar.js/jquery.easing.min.js )
Rails.application.config.assets.precompile += %w( stickyNavbar.js/jquery.stickyNavbar.min.js )
Rails.application.config.assets.precompile += %w( autosize/dest/autosize.min.js )
Rails.application.config.assets.precompile += %w( dropzone/dist/min/dropzone.min.js ) 
Rails.application.config.assets.precompile += %w( main.js )
Rails.application.config.assets.precompile += %w( project-new.js )