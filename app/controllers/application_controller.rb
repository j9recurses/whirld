class ApplicationController < ActionController::Base

  #include OpenIdAuthentication # shouldn't be necessary!!
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

 # Overload handle_unverified_request to ensure that
  # exception is raised each time a request does not
  # pass validation.
  def handle_unverified_request
    raise(ActionController::InvalidAuthenticityToken)
  end



  include PublicActivity::StoreController

  helper :all # include all helpers, all the time




end




