require 'uri'

# This controller handles the login/logout function of the site.
class SessionsController < ApplicationController
  #protect_from_forgery :except => [:create]

  layout 'application2'


  def youtube_create
    auth = request.env['omniauth.auth']
    youtubeuser = YoutubeUser.find_or_initialize_by_uid(uid: auth['uid'])
    youtubeuser.user_id = current_user.id
    youtubeuser.youtube_name = auth['info']['name']
    youtubeuser.save
    session[:youtube_user_id] = youtubeuser.id
    session[:youtube_user_token] = auth['credentials']['token']
    flash[:success] = "You've signed into youtube as the following user: #{youtubeuser.youtube_name}!"
    redirect_to new_video_path
  end

  def fail
    render text: "Sorry, but the following error has occured: #{params[:message]}. Please try again or contact
    administrator."
  end

end
