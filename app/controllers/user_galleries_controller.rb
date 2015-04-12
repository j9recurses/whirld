class UserGalleriesController < ApplicationController

  def index
    @galleries = Gallery.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @galleries }
    end
  end


  def show
    @user_gallery = Gallery.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @user_gallery }
    end
  end


  def new
    @user_gallery = Gallery.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @user_gallery }
    end
  end


  def edit
    @user_gallery = UserGallery.find(params[:id])
  end


  def create
    @user_gallery = UserGallery.new(params[:gallery])

    respond_to do |format|
      if @user_gallery.save
        format.html { redirect_to galleries_url, notice: 'Gallery was successfully created.' }
        format.json { render json: @user_gallery, status: :created, location: @user_gallery }
      else
        format.html { render action: "new" }
        format.json { render json: @user_gallery.errors, status: :unprocessable_entity }
      end
    end
  end


  def update
    @user_gallery = UserGallery.find(params[:id])

    respond_to do |format|
      if @user_gallery.update_attributes(params[:gallery])
        format.html { redirect_to galleries_url , notice: 'Gallery was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @user_gallery.errors, status: :unprocessable_entity }
      end
    end
  end


  def destroy
    @user_gallery = UserGallery.find(params[:id])
    @user_gallery.destroy

    respond_to do |format|
      format.html { redirect_to galleries_url }
      format.json { head :no_content }
    end
  end
end
