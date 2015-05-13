require 'open3'
include ApplicationHelper
class MapsController < ApplicationController
  protect_from_forgery :except => [:export]
  before_filter :authenticate_user!,  :except => [:index, :show, :images, :search, :autocomplete]
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
    puts "****search"
    puts params
    puts "**************"
    if params[:query ] or params[':query']
      puts "***in here query form***"
      @maps = Map.simple_search(params)
      @maps = Map.search_type(@maps, params)
      puts @maps
    else
      puts params
      @maps = Map.where(["finished = 0"])
      @maps = Map.search_type(@maps, params)
    end
    respond_to do |format|
      if params[:query ]
        format.json { render :json => @maps, :methods => [:search_geo_name, :search_term , :search_term_bar, :taglist, :collaborator_list, :coverphoto_name, :search_order, :geographic_search, :search_entity, :ndist, :whirls, :user_gallery_id, :comment_count]}
        format.html {render "maps/index" }
      else
        format.html { render "maps/index" }
      end
    end
  end

  def coverphoto_uploader
    puts "COVER PHOTO HEREEEE"
    puts params
    puts "******"
    if params[:photo]
      user_gallery =  UserGallery.find(params[:id])
      puts user_gallery.inspect
      @map = Map.find(user_gallery.map_id)
      @photo = user_gallery.photos.new
      @photo.photo_file = params[:photo]
      @photo.user_id = current_user.id
      puts "here"
    end
    respond_to do |format|
      if @photo.save
        @map.coverphoto = @photo.id
        @map.coverphoto_name = @photo.photo_file.medium.url
        puts "made it here"
        format.json { render :json => @maps, :methods => [:coverphoto_name]}
      else
        format.json { render "Error! Something went wrong! Couldn't save map coverphoto." }
      end
    end
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
    @map.description = params[:description]
    @map.name = params[:name].strip.downcase.gsub(/[\W]+/,'_')
    @map.user_id = current_user.id
    @map.slug = params[:name].strip.downcase.gsub(/[\W]+/,'_')
    gallery = UserGallery.new()
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
    @user_id = current_user.id
    @user_name = current_user.login
    @user_gallery = UserGallery.find(user_gallery_id[0])
    @gallery_photos =  @map.photos
    @photo = Photo.new
    @extra_js = true  # for layout differentiation
    @project_editor = true # for layout differentiation
    render "map_info"
  end


  def map_info_finish
    @map = Map.find params[:id]
    puts "**************"
    puts params[:mod_order].inspect
    puts "*************"
    @map.finished_dt = Time.now
    @map.author = current_user
    @map.save
    puts @map.errors.messages
    user_gallery_id = UserGallery.where(map_id: @map[:id]).pluck(:id)
    @user_gallery = UserGallery.find(user_gallery_id[0])
    @user_gallery.module_order  = params[:mod_order]
    if @map.save && @user_gallery.save
      render :js => "window.location = '/maps/#{@map.name}'"
    else
      render json: "error! something went wrong!!"
    end
  end

  def show
    @map = Map.find params[:id]
    @map =  get_whirl_stuff(@map)
    @map.taglist = @map.tags.pluck([:name])
    #comments
    @map = get_comment_stuff(@map)
    #get whirls
    @user_gallery = UserGallery.where(['map_id = ?', @map]).first
    @grids = UserGalleryGrid.gather_gallery_grids(@user_gallery[:id])
    @block_texts  = UserGalleryBlocText.gather_bloc_texts(@user_gallery[:id])
    @splits = UserGallerySplit.gather_gallery_splits(@user_gallery[:id])
    @comps = UserGalleryComparison.gather_gallery_comparisions(@user_gallery[:id])
    @map.zoom ||= 12
    @embed = true
    @user = @map.user_id
    @collaborators = @map.users
    if @collaborators.size == 0
      @collaborators = Array.new
      @collaborators << User.find(@map.user_id)
    end
    @nearby_maps = Map.find_nearby_maps(@map)
    @nearby_maps = get_map_coverphotos(@nearby_maps)
    @map_comments =  @map.comment_threads
  end


  def annotate
    @map = Map.find params[:id]
    @map.zoom = 12 # get rid of this; use setBounds or something
    @annotations = true # loads annotations-specific assets
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
    params.delete "user-gal-id"
    unless params[:name].nil?
     params[:name] =  params[:name].strip.downcase.gsub(/[\W]+/,'_')
      params[:slug] = params[:name].strip.downcase.gsub(/[\W]+/,'_')
    end
    if params[:tagList]
      @map.taglist = parse_taglist(params[:tagList], "map", @map.id)
    end
    @map = @map.update_attributes(params)
    respond_to do |format|
      format.json { render json: @map }
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
      puts "********"
      puts warpable.image.url
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
