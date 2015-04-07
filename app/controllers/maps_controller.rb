require 'open3'

class MapsController < ApplicationController
  protect_from_forgery :except => [:export]
  before_filter :authenticate_user!,  :except => [:index, :show, :images]



  layout 'mapknitter'

  def index
    @maps = Map.page(params[:page]).per_page(20).where(:archived => false,:password => '').order('updated_at DESC')
    render :layout => 'mapknitter'
  end

  def new
    @map = Map.new
  end

  def create
      @user = current_user
      @map = @user.maps.new(params[:map])
      @map.author = @user.login
      puts @map.inspect
      if @map.save
        redirect_to "/maps/#{@map.slug}"
      else
        render "new"
      end
  end

  def show
    @map = Map.find params[:id]
    @map.zoom ||= 12
    # remove following lines once legacy interface is deprecated
    if params[:legacy]
      render :template => 'map/show', :layout => 'knitter'
    end
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

end
