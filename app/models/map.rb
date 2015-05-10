require 'open3'

class NotAtOriginValidator < ActiveModel::Validator
  def validate(record)
    if record.lat == 0 || record.lon == 0
      record.errors[:base] << "Your location at 0,0 is unlikely."
    end
  end
end

class Map < ActiveRecord::Base
  geocoded_by :address, :latitude  => :lat, :longitude => :lon
  extend FriendlyId
  include PublicActivity::Model
  tracked owner: Proc.new{ |controller, model| controller.current_user }
  acts_as_commentable
  acts_as_votable

  friendly_id :name
  trimmed_fields  :author, :name, :slug, :lat, :lon, :location, :description, :zoom, :tag_list

  attr_accessible :author, :name, :slug, :lat, :lon, :location, :description, :zoom, :tag_list, :finished, :finished_dt,:whirls, :coverphoto

  validates_presence_of :name, :slug, :author, :lat, :lon
  validates_uniqueness_of :slug
  validates_presence_of :location, :message => ' cannot be found. Try entering a latitude and longitude if this problem persists.'
  validates_format_of   :slug,
    :with => /^[\w-]*$/,
    :message => " must not include spaces and must be alphanumeric, as it'll be used in the URL of your map, like: http://mapknitter.org/maps/your-map-name. You may use dashes and underscores.",
    :on => :create
  validates_with NotAtOriginValidator
  has_many :tags, :as => :taggable, dependent: :destroy
  has_many :user_galleries, dependent: :destroy
  has_many :photos,  through: :user_galleries
  has_many :user_gallery_grids, through: :user_galleries
  has_many :user_gallery_splits, through: :user_galleries
  has_many :user_gallery_bloc_texts, through: :user_galleries
  has_many :user_gallery_comparisons, through: :user_galleries
  has_many :collaborators,  dependent: :destroy
  has_many :users, through: :collaborators
  has_many :annotations, :dependent => :destroy
  has_many :votes,  dependent: :destroy
  include Tire::Model::Search
  include Tire::Model::Callbacks

  #FOR SEARCH
  after_touch() { tire.update_index }

  #set the search units for tire
  SEARCH_UNIT   = "mi"
  SEARCH_RADIUS = "300mi"
  SEARCH_ORDER  = "asc"

  tire do
    settings analysis: {
      filter: {
        ngram_filter: {
          type: 'nGram',
          min_gram: 2,
          max_gram: 12
        }
      },
      analyzer: {
        index_ngram_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase', 'ngram_filter']
        },
        search_ngram_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase']
        }
      }
    } do
      mapping do
        indexes :name, type: 'string', index_analyzer: "index_ngram_analyzer", search_analyzer: "search_ngram_analyzer", boost: 50
        indexes :description,   type: 'string', analyzer: 'snowball'
        indexes :lat_lon, type: 'geo_point'
        indexes :id, :index    => :not_analyzed
      end

      indexes :tags do
        indexes :name, index_analyzer: "index_ngram_analyzer", search_analyzer: "search_ngram_analyzer"
      end
    end

  end

  def lat_lon
    [lat, lon].join(',')
  end

  def to_indexed_json
    # to_json(only: ['name', 'description'], methods: ['lat_lon'])
    to_json(:include => [:tags], :methods => [:lat_lon])
  end

  def self.simple_search(params)
    unless params[:location].blank?
      point  = self.get_search_cords(params[:location])
      unless params[:query].blank?
        s = Tire.search('maps') { query { match [:name, :description, :name],  params[:query]  } }
      else
        s = Tire.search('maps') { query { all } }
      end
      s. filter :geo_distance, lat_lon: point, distance: '300km'
      s.sort {  by "_geo_distance", {
                  "lat_lon" => point,
                  "order"       => SEARCH_ORDER,
                  "unit"        => SEARCH_UNIT
                }
                }
      results = s.results
    else
      results = Map.search do
        query { match [:name, :description, :name],  params[:query] }
      end
    end
    return results
  end
  #

  def self.get_search_cords(location)
    geo = Geocoder.coordinates(location)
    point = "#{geo[0]}, #{geo[1]}"
    return point
  end

  def self.find_nearby_maps(map)
    neighbors = Map.near([map.lat, map.lon], 100)
    neighbor_info = Array.new
    neighbors.each do | n|
      unless map.id == n.id
        n.ndist = neighbor_distance(map.lat, map.lon, n.lat, n.lon)
        n.taglist = n.tags.pluck([:name])
        neighbor_info << n
      end
    end
    return neighbor_info
  end

  def self.neighbor_distance(lat1, lon1, lat2, lon2)
    distance = Geocoder::Calculations.distance_between([lat1, lon1], [lat2, lon2])
    return distance
  end

  ##extra info for ajax'd json back to server
  def self.search_type(maps, params)
    search_info_maps = Array.new
    counter = 1
    maps.each do |map|
      #unless map.sort.blank?
       # distance_away = map.sort
      #end
      map = Map.find(map.id)
      unless params[:location].blank?
        puts params[:location]
        map.geographic_search = 1
      else
        map.geographic_search = 0
      end
      if params[:entity]
        map.search_entity = params[:entity]
      end
      puts map.name
      #map.ndist = distance
      map.taglist = map.tags
      map.collaborator_list = collaborators_list(map)
      map.search_order = counter
      coverphoto = Photo.find(map.coverphoto)
      map.user_gallery_id = coverphoto.user_gallery_id
      map.coverphoto_name = coverphoto.photo_file.medium.url
      puts "****here****"
      puts map.coverphoto_name
      unless map.votes_for.nil?
        map.whirls = map.votes_for.size
      end
      unless map.comment_threads.nil?
        map.comment_count = map.comment_threads.size
      end
      counter = counter + 1
      search_info_maps << map
    end
    return search_info_maps
  end



  has_many :warpables do
    def public_filenames
      filenames = {}
      self.each do |warpable|
        filenames[warpable.id] = {}
        sizes = Array.new(Warpable::THUMBNAILS.keys).push(nil)
        sizes.each do |size|
          key = size != nil ? size : "original"
          filenames[warpable.id][key] = warpable.public_filename(size)
        end
      end
      filenames
    end
  end



  attr_accessor :search_order, :search_entity, :ndist, :whirls, :comment_count, :collaborator_list, :geographic_search, :taglist, :coverphoto_name, :user_gallery_id




  # #attr_accessor  :search_order
  # def search_order
  #   @search_order
  # end

  # def search_order=(val)
  #   @search_order = val
  # end

  # def search_entity
  #   @search_entity
  # end

  # def search_entity=(val)
  #   @search_entity= val
  # end

  # def ndist
  #   @ndist
  # end

  # def ndist=(val)
  #   @ndist = val
  # end

  # def whirls
  #   @whirls
  # end

  # def whirls=(val)
  #   @whirls = val
  # end

  #  def comment_count
  #   @comment_count
  # end

  # def comment_count=(val)
  #   @comment_count = val
  # end



  def validate
    self.name != 'untitled'
    self.lat >= -90 && self.lat <= 90 && self.lon >= -180 && self.lat <= 180
  end

  # Hash the password before saving the record
  def before_create
    self.password = Password::update(self.password) if self.password != ""
  end

  # this might have been for a migration; grep for it
  def update_name
    self.name = self.name.gsub(/\W/, '-').downcase
  end

  def placed_warpables
    self.warpables.where('width > 0 AND nodes <> ""')
  end

  def private
    self.password != ""
  end

  def anonymous?
    self.author == "" || self.user_id == 0
  end

  def self.bbox(minlat,minlon,maxlat,maxlon)
    Map.find :all, :conditions => ['lat > ? AND lat < ? AND lon > ? AND lon < ?',minlat,maxlat,minlon,maxlon]
  end

  def exporting?
    self.export && self.export.running?
  end

  def export
    self.latest_export
  end

  def latest_export
    self.exports.last
  end

  def self.authors(limit = 50)
    Map.find(:all, :limit => limit, :group => "maps.author", :order => "id DESC", :conditions => ['password = "" AND archived = "false"']).collect(&:author)
  end

  def self.new_maps
    self.find(:all, :order => "created_at DESC", :limit => 12, :conditions => ['password = "" AND archived = "false"'])
  end

  def nodes
    nodes = {}
    self.warpables.each do |warpable|
      if warpable.nodes != ''
        w_nodes = []
        warpable.nodes.split(',').each do |node|
          node_obj = Node.find(node)
          w_nodes << [node_obj.lon,node_obj.lat]
        end
        nodes[warpable.id.to_s] = w_nodes
      end
      nodes[warpable.id.to_s] ||= 'none'
    end
    nodes
  end

  # find all other maps within <dist> degrees lat or lon
  def nearby_maps(dist)
    if self.lat.to_f == 0.0 || self.lon.to_f == 0.0
      return []
    else
      return Map.find(:all,:conditions => ['id != ? AND lat > ? AND lat < ? AND lon > ? AND lon < ?',self.id,self.lat-dist,self.lat+dist,self.lon-dist,self.lon+dist], :limit => 10)
    end
  end

  def average_scale
    # determine optimal zoom level
    puts '> calculating scale'
    pxperms = []
    self.placed_warpables.each do |warpable|
      pxperms << 100.00/warpable.cm_per_pixel if warpable.placed?
    end
    average = (pxperms.inject {|sum, n| sum + n })/pxperms.length
    average
  end

  def best_cm_per_pixel
    hist = self.images_histogram
    scores = []
    (0..(hist.length-1)).each do |i|
      scores[i] = 0
      scores[i] += hist[i-3] if i > 3
      scores[i] += hist[i-2] if i > 2
      scores[i] += hist[i-1] if i > 1
      scores[i] += hist[i]
      scores[i] += hist[i+1] if i < hist.length - 2
      scores[i] += hist[i+2] if i < hist.length - 3
      scores[i] += hist[i+3] if i < hist.length - 4
    end
    highest = 0
    scores.each_with_index do |s,i|
      highest = i if s > scores[highest]
    end
    highest
  end

  def average_cm_per_pixel
    if self.warpables.length > 0
      scales = []
      count = 0
      average = 0
      self.placed_warpables.each do |warpable|
        count += 1
        res = warpable.cm_per_pixel
        res = 1 if res == 0 # let's not ever try to go for infinite resolution
        scales << res unless res == nil
      end
      sum = (scales.inject {|sum, n| sum + n }) if scales
      average = sum/count if sum
    average
    else
      0
    end
  end

  # for sparklines graph display
  def images_histogram
    hist = []
    self.warpables.each do |warpable|
      res = warpable.cm_per_pixel.to_i
      hist[res] = 0 if hist[res] == nil
      hist[res] += 1
    end
    (0..hist.length-1).each do |bin|
      hist[bin] = 0 if hist[bin] == nil
    end
    hist
  end

  # for sparklines graph display
  def grouped_images_histogram(binsize)
    hist = []
    self.warpables.each do |warpable|
      res = warpable.cm_per_pixel
      if res != nil
        res = (warpable.cm_per_pixel/(0.001+binsize)).to_i
        hist[res] = 0 if hist[res] == nil
        hist[res] += 1
      end
    end
    (0..hist.length-1).each do |bin|
      hist[bin] = 0 if hist[bin] == nil
    end
    hist
  end

  def run_export(user,resolution)
    begin
      unless export = self.export
        export = Export.new({
                              :map_id => self.id
        })
      end
      export.user_id = user.id if user
      export.status = 'starting'
      export.tms = false
      export.geotiff = false
      export.zip = false
      export.jpg = false
      export.save

      directory = "#{Rails.root}/public/warps/"+self.name+"/"
      stdin, stdout, stderr = Open3.popen3('rm -r '+directory.to_s)
      puts stdout.readlines
      puts stderr.readlines
      stdin, stdout, stderr = Open3.popen3("rm -r #{Rails.root}/public/tms/#{self.name}")
      puts stdout.readlines
      puts stderr.readlines

      puts '> averaging scales'
      pxperm = 100/(resolution).to_f || self.average_scale # pixels per meter

      puts '> distorting warpables'
      origin = self.distort_warpables(pxperm)
      warpable_coords = origin.pop

      export = self.export
      export.status = 'compositing'
      export.save

      puts '> generating composite tiff'
      composite_location = self.generate_composite_tiff(warpable_coords,origin)

      info = (`identify -quiet -format '%b,%w,%h' #{composite_location}`).split(',')
      puts info

      export = self.export
      if info[0] != ''
        export.geotiff = true
        export.size = info[0]
        export.width = info[1]
        export.height = info[2]
        export.cm_per_pixel = 100.0000/pxperm
        export.status = 'tiling'
        export.save
      end

      puts '> generating tiles'
      export = self.export
      export.tms = true if self.generate_tiles
      export.status = 'zipping tiles'
      export.save

      puts '> zipping tiles'
      export = self.export
      export.zip = true if self.zip_tiles
      export.status = 'creating jpg'
      export.save

      puts '> generating jpg'
      export = self.export
      export.jpg = true if self.generate_jpg
      export.status = 'complete'
      export.save

    rescue SystemCallError
      export = self.export
      export.status = 'failed'
      export.save
    end
    return export.status
  end

  # distort all warpables, returns upper left corner coords in x,y
  def distort_warpables(scale)
    export = self.latest_export
    puts '> generating geotiffs of each warpable in GDAL'
    lowest_x=0
    lowest_y=0
    warpable_coords = []
    warpables = self.placed_warpables
    current = 0
    warpables.each do |warpable|
      current += 1
      export.status = 'warping '+current.to_s+' of '+warpables.length.to_s
      puts 'warping '+current.to_s+' of '+warpables.length.to_s
      export.save
      my_warpable_coords = warpable.generate_perspectival_distort(scale,self.name)
      puts '- '+my_warpable_coords.to_s
      warpable_coords << my_warpable_coords
      lowest_x = my_warpable_coords.first if (my_warpable_coords.first < lowest_x || lowest_x == 0)
      lowest_y = my_warpable_coords.last if (my_warpable_coords.last < lowest_y || lowest_y == 0)
    end
    [lowest_x,lowest_y,warpable_coords]
  end

  # generate a tiff from all warpable images in this set
  def generate_composite_tiff(coords,origin)
    directory = "public/warps/"+self.name+"/"
    composite_location = directory+self.name+'-geo.tif'
    geotiffs = ''
    minlat = nil
    minlon = nil
    maxlat = nil
    maxlon = nil
    self.placed_warpables.each do |warpable|
      warpable.nodes_array.each do |n|
        minlat = n.lat if minlat == nil || n.lat < minlat
        minlon = n.lon if minlon == nil || n.lon < minlon
        maxlat = n.lat if maxlat == nil || n.lat > maxlat
        maxlon = n.lon if maxlon == nil || n.lon > maxlon
      end
    end
    first = true
    # sort by area; this would be overridden by a provided order
    warpables = self.placed_warpables.sort{|a,b|b.poly_area <=> a.poly_area}
    warpables.each do |warpable|
      geotiffs += ' '+directory+warpable.id.to_s+'-geo.tif'
      if first
        gdalwarp = "gdalwarp -te "+minlon.to_s+" "+minlat.to_s+" "+maxlon.to_s+" "+maxlat.to_s+" "+directory+warpable.id.to_s+'-geo.tif '+directory+self.name+'-geo.tif'
        first = false
      else
        gdalwarp = "gdalwarp "+directory+warpable.id.to_s+'-geo.tif '+directory+self.name+'-geo.tif'
      end
      puts gdalwarp
      system(Gdal.ulimit+gdalwarp)
    end
    composite_location
  end

  # generates a tileset at Rails.root.to_s/public/tms/<map_name>/
  def generate_tiles
    google_api_key = APP_CONFIG["google_maps_api_key"]
    gdal2tiles = 'gdal2tiles.py -k -t "'+self.name+'" -g "'+google_api_key+'" '+Rails.root.to_s+'/public/warps/'+self.name+'/'+self.name+'-geo.tif '+Rails.root.to_s+'/public/tms/'+self.name+"/"
    #    puts gdal2tiles
    #    puts system('which gdal2tiles.py')
    system(Gdal.ulimit+gdal2tiles)
  end

  # zips up tiles at Rails.root/public/tms/<map_name>.zip
  def zip_tiles
    rmzip = 'cd public/tms/ && rm '+self.name+'.zip && cd ../../'
    system(Gdal.ulimit+rmzip)
    zip = 'cd public/tms/ && zip -rq '+self.name+'.zip '+self.name+'/ && cd ../../'
    #    puts zip
    #    puts system('which gdal2tiles.py')
    system(Gdal.ulimit+zip)
  end

  def generate_jpg
    imageMagick = 'convert -background white -flatten '+Rails.root.to_s+'/public/warps/'+self.name+'/'+self.name+'-geo.tif '+Rails.root.to_s+'/public/warps/'+self.name+'/'+self.name+'.jpg'
    system(Gdal.ulimit+imageMagick)
  end

  def after_create
    puts 'saving Map'
    if last = Map.find_by_name(self.name,:order => "version DESC")
      self.version = last.version + 1
    end
  end

  def license_link
    if self.license == "cc-by"
      "<a href='http://creativecommons.org/licenses/by/3.0/'>Creative Commons Attribution 3.0 Unported License</a>"
    elsif self.license == "publicdomain"
      "<a href='http://creativecommons.org/publicdomain/zero/1.0/'>Public Domain</a>"
    end
  end

  def polygons(dist)
    nodes = Node.find(:all,:conditions => ['lat > ? AND lat < ? AND lon > ? AND lon < ? AND way_id != 0 AND map_id != 0',self.lat-dist,self.lat+dist,self.lon-dist,self.lon+dist], :limit => 50, :order => "way_order DESC")
    Way.where('id IN (?)',nodes.collect(&:way_id).uniq)
  end

  def legacy_annotations(dist)
    Node.find(:all,:conditions => ['lat > ? AND lat < ? AND lon > ? AND lon < ? AND way_id = 0 AND map_id != 0',self.lat-dist,self.lat+dist,self.lon-dist,self.lon+dist], :limit => 50, :order => "id DESC")
  end

  #--------------------



end
