require 'uri'

# This controller handles the login/logout function of the site.
class SessionsController < ApplicationController
  #protect_from_forgery :except => [:create]

  layout 'application2'


  def create
    auth = request.env['omniauth.auth']
    puts "***************"
    user = User.find_or_initialize_by(id: auth['uid'])
    user.token = auth['credentials']['token']
    user.name = auth['info']['name']
    user.save
    session[:user_id] = user.id
    flash[:success] = "Welcome, #{user.name}!"
    redirect_to new_video_path
  end
  def fail
    render text: "Sorry, but the following error has occured: #{params[:message]}. Please try again or contact
    administrator."
  end

end
