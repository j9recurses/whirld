class PhotosController < ApplicationController
  def index
  end


  def show
    @photo = Photo.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @photo }
    end
  end


  def new
    @photo = Photo.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @photo }
    end
  end


  def create
    @photo = Photo.new(params[:photo])
    if @photo.save
    else
      render :json => { "errors" => @photo.errors }
    end
  end


  def destroy
    @photo = Photo.find(params[:id])
    @photo.destroy

    respond_to do |format|
      format.html { redirect_to gallery_photos_path(@gallery) }
      format.json { head :no_content }
    end
  end
end


private

def the_gallery
  @user_gallery = UserGallery.find(params["gallery_id"])
end
