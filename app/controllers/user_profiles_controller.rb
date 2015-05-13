

class UserProfilesController < ApplicationController
 include ApplicationHelper

 layout :resolve_layout

  def resolve_layout
    case action_name
    when "show"
      "application"
    end
  end

  def show
    @user = User.find(params[:id])
    @user_profile = @user.user_profile
    @user.taglist = @user.tags.pluck([:name])
    @neighbors = UserProfile.find_nearby_users(@user_profile)
    #get the last 10 actions the user did
    @activities = PublicActivity::Activity.where(owner_id: @user.id).last(15).reverse
    @maps = Collaborator.where("user_id = ?", @user.id).uniq.pluck(:map_id)
    @maps = Map.find(@maps)
   # @user.maps.where(["maps.finished_dt != ?",  ])
    @maps = get_maptags(@maps)
    @maps = get_map_coverphotos(@maps)
    @collaborators = UserProfile.get_collaborators(@maps)
    @user_photos  = UserProfile.get_photo_gallery(@user.id)
    @photos_contributed =  Photo.count(:conditions => ["user_id = ?", @user.id])
    @collaborators_list = UserProfile.get_collaborators_list(@user.id)
    #find similar users?
  end


  def edit
    @user = User.find(params[:id])
    @user_profile = @user.user_profile
  end


  def update
    puts params
    @user_profile = UserProfile.find(params[:id])
    up = params["user_profile"]
    @user_profile.description = up[:description]
    @user_profile.last_name = up[:last_name]
    @user_profile.location = up[:location]
    geoloc =  Geocoder.coordinates( @user_profile.location)
    @user_profile.lat = geoloc[0]
    @user_profile.lon = geoloc[1]
    @user_profile.first_name = up[:first_name]
    @user_profile.photo_file = up[:photo_file]
    @user = User.find(@user_profile.user_id)
    if @user_profile.save
      tags = parse_taglist(up[:taglist], "user_profile", @user_profile.id)
    @user = User.find(@user_profile[:id])
      redirect_to user_profile_path(@user.id)
    else
      redirect_to user_profile_edit(@user.id), :flash => { :error => "Something went wrong! Could not save profile!" }
    end
  end

end



