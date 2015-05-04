class ApplicationController < ActionController::Base
  #include OpenIdAuthentication # shouldn't be necessary!!
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
 # include PublicActivity::StoreController

  helper :all # include all helpers, all the time




end
