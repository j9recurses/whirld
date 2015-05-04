require 'open3'
include ApplicationHelper
class MapsController < ApplicationController
  protect_from_forgery :except => [:export]
  before_filter :authenticate_user!,  :except => [:index, :show, :images]
  layout :resolve_layout

  def resolve_layout
    case action_name
    when "new", "create", "map_info"
      "layout_create"
    when "index", "show"
      "layout_read"
    when "search"
      "layout_search"

    else
      "application"
    end
  end

  def search
    puts params
    if params[:query ]
      @maps = Map.simple_search(params)
    else
      @maps = Map.all
    end
    @user = current_user
    @maps = Map.get_maptags(@maps)
    @maps = Map.get_photos(@maps)
    @maps = Map.search_type(@maps, params)
    respond_to do |format|
      if params[:query ]
        format.json { render :json => @maps, :methods => [:taglist, :coverphoto_name, :search_order, :geographic_search, :search_entity ]}
      else
        format.html { render "maps/index" }
      end
    end
  end



  def search_top_navbar
    puts params.inspect
  end


  def autocomplete
    maps = Map.order(:name).where("name LIKE ?", "%#{params[:term]}%")
    maptags = Tag.order(:name).where(["name LIKE ? and taggable_type = ?", "%#{params[:term]}%", "Map"] )
    @terms = Hash.new
    @terms[:projects] = maps.map(&:name).to_set
    @terms[:tags] = maptags.map(&:name).to_set
    puts @terms.inspect
    respond_to do |format|
      format.html
      format.json {
        render json: @terms
      }
    end
  end

  def index
    @maps = Map.page(params[:page]).per_page(20).where(:archived => false,:password => '').order('updated_at DESC')
    render :layout => 'maps'
  end

  def new
    @map = Map.new
    @extra_js = true  # for layout differentiation
    render :layout => 'layout_create'
  end

  def create
    @user = current_user
    @map = @user.maps.new(params[:map])
    @map.author = @user.login
    @map.name = params[:name]
    @map.slug = params[:name].downcase.gsub(/[\W]+/,'-')
    gallery = UserGallery.new()
    gallery.name = @map.slug
    gallery.user_id = @user.id
    if @map.save && gallery.save
      @collabo = Collaborator.new()
      @collabo[:map_id] = @map.id
      @collabo[:user_id] = @user.id
      @collabo.save
      UserGallery.update(gallery.id, map_id: @map.id)
      redirect_to map_info_path(@map.slug)
    else
      render "new"
    end
  end

  def map_info
    @map = Map.find params[:id]
    user_gallery_id = UserGallery.where(map_id: @map[:id]).pluck(:id)
    @user_gallery = UserGallery.find(user_gallery_id[0])
    @gallery_photos =  @map.photos
    @photo = Photo.new
    @extra_js = true  # for layout differentiation
    @photo_manager = true # for layout differentiation
    render "map_info"
  end


  def map_info_finish
    @map = Map.find params[:id]
    @map[:finished] = true
    user_gallery_id = UserGallery.where(map_id: @map[:id]).pluck(:id)
    @user_gallery = UserGallery.find(user_gallery_id[0])
    @user_gallery[:module_order] = params[:mod_order]
    @map[:finished_dt] = Time.now
    if @user_gallery.save && @map.save
      #@map.create_activity key: 'map.finished', owner: current_user
      render :js => "window.location = '/maps/#{@map[:slug]}'"
    else
      flash[:notice] = "Error! Could not save project!"
    end
  end

  def show
    @map = Map.find params[:id]
    @map.taglist = @map.tags.pluck([:name])
    @user_gallery = UserGallery.where(['map_id = ?', @map]).first
    @grids = UserGalleryGrid.gather_gallery_grids(@user_gallery[:id])
    @block_texts  = UserGalleryBlocText.gather_bloc_texts(@user_gallery[:id])
    @splits = UserGallerySplit.gather_gallery_splits(@user_gallery[:id])
    @comps = UserGalleryComparison.gather_gallery_comparisions(@user_gallery[:id])
    @map.zoom ||= 12
    @embed = true
    @user = @map.user_id
    @collaborators = @map.users
  end



  def annotate
    @map = Map.find params[:id]
    @map.zoom = 12 # get rid of this; use setBounds or something
  end

  def edit
    @map = Map.find params[:id]
  end

  def update
    @map = Map.find params[:id]
    @map.update_attributes(params[:map])
    # save new tags
    if params[:tags]
      params[:tags].gsub(' ', ',').split(',').each do |tagname|
        @map.add_tag(tagname.strip, current_user)
      end
    end
    @map.save
    redirect_to :action => "show"
  end

  def update_remote
    puts "*****"
    puts params.inspect
    @map = Map.find params[:id]
    puts @map.inspect
    #pop unwanted keys off the params hash
    puts params.inspect
    params.delete :id
    params.delete :utf8
    params.delete :commit
    params.delete :action
    params.delete :controller
    params.delete :_method
    params.delete :format
    unless params[:name].nil?
      params[:slug] = params[:name]
    end
    respond_to do |format|
      if @map.update_attributes(params)
        format.json { render json: params  }
      else
        format.json { render json: "error! something went wrong!!" }
      end
    end
  end

  # used by leaflet to fetch corner coords of each warpable
  def images
    map = Map.find params[:id]
    warpables = []
    map.warpables.each do |warpable|
      warpables << warpable
      warpables.last[:nodes] = warpable.nodes_array
      warpables.last.src = warpable.image.url
      warpables.last.srcmedium = warpable.image.url(:medium)
    end
    render :json => warpables
  end

  # run the export
  def export
    map = Map.find params[:id]
    if logged_in? || Rails.env.development? || verify_recaptcha(:model => map, :message => "ReCAPTCHA thinks you're not a human!")
      render :text => map.run_export(current_user,params[:resolution].to_f)
    else
      render :text => 'You must be logged in to export, unless the map is anonymous.'
    end
  end

  # render list of exports
  def exports
    @map = Map.find params[:id]
    render :partial => "maps/exports", :layout => false
  end

  # list by region
  def region
    area = params[:id] || "this area"
    @title = "Maps in #{area}"
    ids = Map.bbox(params[:minlat],params[:minlon],params[:maxlat],params[:maxlon]).collect(&:id)
    @maps = Map.where('id IN (?)',ids).paginate(:page => params[:page], :per_page => 24)
    render "maps/index", :layout => "application2"
  end

  # list by license
  def license
    @title = "Maps licensed '#{params[:id]}'"
    @maps = Map.where(password: '',license: params[:id]).order('updated_at DESC').paginate(:page => params[:page], :per_page => 24)
    render "maps/index", :layout => "application2"
  end

  def create_tags
    @map = Map.find params[:id]
    @map.tag_list.add(params[:tag_list])
  end

  def delete_tags
    @map = Map.find params[:id]
    @map.tag_list.remove(params[:tag_list])
  end

end
