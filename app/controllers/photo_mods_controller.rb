
class PhotoModsController < ApplicationController
  include ApplicationHelper

  def user_gallery_grid_create
    @user_gallery_grid = UserGalleryGrid.new
    @user_gallery_grid[:user_gallery_id] = params[:user_gallery_id]
    respond_to do |format|
      if @user_gallery_grid.save
        format.json { render json:  @user_gallery_grid}
      else
        render :json => { "errors" => @user_gallery_grid.errors }
      end
    end
  end

  def user_gallery_grid_update
    @user_gallery_grid = UserGalleryGrid.find(params[:mod_gallery])
    @user_gallery_grid[:grid_photo_order] =  params[:grid_photo_order]
    respond_to do |format|
      if @user_gallery_grid.save
        format.json { render json:  @user_gallery_grid}
      else
        render :json => { "errors" => @user_gallery_grid.errors }
      end
    end
  end

  def user_gallery_grid_delete
    @user_gallery_grid = UserGalleryGrid.find(params[:mod_gallery])
    respond_to do |format|
      if @user_gallery_grid.destroy
          format.json { head :no_content, status: :ok }
      else
        format.json { render json: @user_gallery_grid.errors, status: :unprocessable_entity }
      end
    end
  end

  ###comparision###
  def user_gallery_comparison_create
    @user_gallery_comparison = UserGalleryComparison.new
    @user_gallery_comparison[:user_gallery_id] = params[:user_gallery_id]
    respond_to do |format|
      if @user_gallery_comparison.save
        format.json { render json:  @user_gallery_comparison}
      else
        render :json => { "errors" => @user_gallery_comparison.errors }
      end
    end
  end

  def user_gallery_comparison_update
    @user_gallery_comparison = UserGalleryComparison.find(params[:mod_gallery])
    @user_gallery_comparison[:comparison_photo_order] = params[:comparison_photo_order]
    respond_to do |format|
      if @user_gallery_comparison.save
        format.json { render json:  @user_gallery_comparison}
      else
        render :json => { "errors" => @user_gallery_comparison.errors }
      end
    end
  end

  def user_gallery_comparison_delete
    @user_gallery_comparison = UserGalleryComparison.find(params[:mod_gallery])
     respond_to do |format|
      if @user_gallery_comparison.destroy
          format.json { head :no_content, status: :ok }
      else
        format.json { render json:  @user_gallery_comparison.errors, status: :unprocessable_entity }
      end
    end
  end

  ##split####
  def user_gallery_split_create
    @user_gallery_split = UserGallerySplit.new
    @user_gallery_split[:user_gallery_id] = params[:user_gallery_id]
    respond_to do |format|
      if @user_gallery_split.save
        format.json { render json:  @user_gallery_split}
      else
        render :json => { "errors" => @user_gallery_split.errors }
      end
    end
  end

  def user_gallery_split_update
    @user_gallery_split = UserGallerySplit.find(params[:mod_gallery])
    @user_gallery_split[:split_photo_order] = params[:photo_order]
    respond_to do |format|
      if @user_gallery_split.save
        format.json { render json:  @user_gallery_split}
      else
        render :json => { "errors" => @user_gallery_split.errors }
      end
    end
  end

  def user_gallery_split_delete
    @user_gallery_split = UserGallerySplit.find(params[:mod_gallery])
    respond_to do |format|
      if  @user_gallery_split.destroy
          format.json { head :no_content, status: :ok }
      else
        format.json { render json: @user_gallery_split.errors, status: :unprocessable_entity }
      end
    end
  end

  ##text blocks
  def user_gallery_text_create
    @user_gallery_text = UserGalleryBlocText.new
    @user_gallery_text[:user_gallery_id] = params[:user_gallery_id]
    respond_to do |format|
      if @user_gallery_text.save
        format.json { render json:  @user_gallery_text}
      else
        render :json => { "errors" => @user_gallery_text.errors }
      end
    end
  end

  def user_gallery_text_update
    @user_gallery_bloc_txt = UserGalleryBlocText.find(params[:mod_gallery])
    @user_gallery_bloc_txt[:bloc_text] = params[:bloc_text]
    respond_to do |format|
      if @user_gallery_bloc_txt.save
        format.json { render json:  @user_gallery_bloc_txt}
      else
        render :json => { "errors" => @user_gallery_bloc_txt.errors }
      end
    end
  end


  def user_gallery_text_delete
    @user_gallery_bloc_txt = UserGalleryBlocText.find(params[:mod_gallery])
    respond_to do |format|
      if @user_gallery_bloc_txt.destroy
          format.json { head :no_content, status: :ok }
      else
        format.json { render json: @user_gallery_bloc_txt.errors, status: :unprocessable_entity }
      end
    end
  end


  ####photo mod###
  def place_mod_photo
    #check to see if the photo exists, and if not create it.
    @photo_mod = PhotoMod.where("photo_id = ? and mod_gallery_id = ?",  params[:photo_id], params[:mod_gallery] )
    unless @photo_mod.empty?
      @photo_mod = PhotoMod.find(@photo_mod[0][:id])
      @photo_mod[:caption] = params[:caption]
    else
      @photo_mod = PhotoMod.new
      @photo_mod[:photo_id] = params[:photo_id]
      @photo_mod[:mod_gallery_id] = params[:mod_gallery]
      @photo_mod[:caption] = params[:caption]
      if params[:modtype] = 'grid'
        @photo_mod[:mod_gallery_type] = 'UserGalleryGrid'
      elsif params[:modtype] = 'split'
        @photo_mod[:mod_gallery_type] = 'UserGallerySplit'
      elsif params[:modtype] = 'comparision'
        @photo_mod[:mod_gallery_type] = 'UserGalleryComparison'
      end
    end
    respond_to do |format|
      if @photo_mod.save
        format.json { render json:  @photo_mod}
      else
        render :json => { "errors" => @photo_mod.errors }
      end
    end
  end

  def remove_mod_photo
    @photo_mod = PhotoMod.find(params[:id])
    respond_to do |format|
      if @photo_mod.destroy
          format.json { head :no_content, status: :ok }
      else
        format.json { render json: @photo_mod.errors, status: :unprocessable_entity }
      end
    end
  end

  #taggings
  def create_taggings
    @item = parse_taglist(params[:taglist], params[:mod_type], params[:mod_gallery])
    puts @item.inspect
    respond_to do |format|
        format.json { render json:@item}
    end
  end

  def delete_tagings
    @tag_item = Tag.find(params[:tag_id])
    respond_to do |format|
      if @tag_item.destroy
          format.json { head :no_content, status: :ok }
      else
        format.json { render json: @tag_item.errors, status: :unprocessable_entity }
      end
    end
  end


end
