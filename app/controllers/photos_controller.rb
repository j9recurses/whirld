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
    @photo[:user_id] = current_user.id
    if @photo.save
      photo_class_name = @photo.class.to_s.underscore
      #Delayed::Job.enqueue PhotoProcessing.new(photo_class_name, @photo[:user_gallery_id], @photo[:id])
      @photo = Photo.deepLearnPredict(@photo)
      puts @photo.inspect
      @photo = Photo.make_warpable(@photo)
      respond_to do |format|
        format.json { render json:  @photo } # , methods: [:warpable_id, :warpable_url, :warpable_url] }
      end
    else
        render :json => { "errors" => @photo.errors }
    end
  end

  def destroy
    @photo = Photo.find(params[:id])
    respond_to do |format|
      if @photo.destroy
        format.json { head :no_content, status: :ok }
      else
        format.json { render json: @user_gallery_grid.errors, status: :unprocessable_entity }
      end
    end
    # @photo = Photo.find(params[:id])
    # @photo.destroy
    # respond_to do |format|
    #   format.html { redirect_to gallery_photos_path(@gallery) }
    #   format.json { head :no_content }
    # end
  end
end



private

def the_gallery
  @user_gallery = UserGallery.find(params[:user_gallery_id])
  puts @user_gallery.inspect
end
