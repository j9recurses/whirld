require 'open3'

class MapsController < ApplicationController
  protect_from_forgery :except => [:export]
  before_filter :authenticate_user!,  :except => [:index, :show, :images]

  layout 'map'

  def index
    @maps = Map.page(params[:page]).per_page(20).where(:archived => false,:password => '').order('updated_at DESC')
    render :layout => 'maps'
  end

  def new
    @map = Map.new
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
        UserGallery.update(gallery.id, map_id: @map.id)
        redirect_to "/maps/map_info/#{@map.slug}"
      else
        render "new"
      end
  end

  def map_info
    @map = Map.find params[:id]
    user_gallery_id = UserGallery.where(map_id: @map[:id]).pluck(:id)
    @user_gallery = UserGallery.find(user_gallery_id[0])
    puts @user_gallery.inspect
    @photo = Photo.new
    render "map_info"
  end

  def show
    @map = Map.find params[:id]
    @map_tags = @map.tags
    @map.zoom ||= 12
  end

  def embed
    @map = Map.find params[:id]
    @map.zoom ||= 12
    @embed = true
    render :template => 'maps/show'
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

  def search
    params[:id] ||= params[:q]
    @maps = Map.where('archived = false AND (name LIKE ? OR location LIKE ? OR description LIKE ?)',"%"+params[:id]+"%", "%"+params[:id]+"%", "%"+params[:id]+"%").paginate(:page => params[:page], :per_page => 24)
    @title = "Search results for '#{params[:id]}'"
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
