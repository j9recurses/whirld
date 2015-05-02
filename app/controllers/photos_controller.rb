class PhotosController < ApplicationController
  before_filter :the_gallery

  def index
    @photos = Photo.where("gallery_id = ?", the_gallery)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @photos }
    end
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
    @photo = @user_gallery.photos.new(params[:photo])
    if @photo.save
      photo_class_name = @photo.class.to_s.underscore
      #Delayed::Job.enqueue PhotoProcessing.new(photo_class_name, @photo[:user_gallery_id], @photo[:id])
      @photo = Photo.deepLearnPredict(@photo)
      @warpable = Photo.make_warpable(@photo)
      @photo.warpable_id =    @warpable.id
      @photo.warpable_url =   @warpable.image.url(:medium)
      @photo.warpable_thumb_url =  @warpable.image.url(:thumb)
      print 'THIS IS THE PHOTO RIGHT HERE'
      print @photo.inspect
      respond_to do |format|
        format.json { render json:  @photo }
      end
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
  @user_gallery = UserGallery.find(params[:user_gallery_id])
  puts @user_gallery.inspect
end
