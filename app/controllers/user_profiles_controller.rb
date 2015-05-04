

class UserProfilesController < ApplicationController
 include ApplicationHelper


  def show
    @user = User.find(params[:id])
    @user_profile = @user.user_profile
    @user_profile.taglist = @user_profile.tags
    @neighbors = UserProfile.find_nearby_users(@user_profile)
    #get the last 10 actions the user did
    @activities = PublicActivity::Activity.where(owner_id: @user.id).last(15).reverse
    @maps =  @user.maps
    @maps = get_photos(@maps)
    @maps = get_maptags(@maps)
    @collaborators = UserProfile.get_collaborators(@maps)
    puts "**"
    puts @maps.size
    #find similar users?
  end


  def edit
    @user = User.find(params[:id])
  end


  def update
  end

end



