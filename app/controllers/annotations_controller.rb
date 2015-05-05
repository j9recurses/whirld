require 'json'

class AnnotationsController < ApplicationController
  # before_filter :require_user, :except => [ :index, :show ]
  before_filter :find_map

  def index
    puts "****"
    puts @map.annotations.inspect
    render :file => 'annotations/index.json.erb', :content_type => 'application/json'
  end

  def create
    geojson = params[:annotation]

    respond_to do |format|
      format.json {
        @annotation = @map.annotations.create(
          :annotation_type => geojson[:properties][:annotation_type],
          :coordinates => geojson[:geometry][:coordinates],
          :text => geojson[:properties][:textContent],
          :style => geojson[:properties][:style],
          :user_id => current_user.id
        )
        if @annotation.save
          puts "******here*****"
          puts @annotation.inspect
          redirect_to map_annotation_url(@map, @annotation)
        end
      }
    end
  end
  #******here*****
#<Annotation id: 53, map_id: 74, user_id: 5,
# annotation_type: "marker", text: nil, style: {},
# coordinates: [-122.31699407449922, 37.84036442015155],

  def show
    @annotation = Annotation.find params[:id]
      puts "******here*****"
          puts @annotation.inspect
    render :file => 'annotations/show.json.erb', :content_type => 'application/json'
     # respond_to do |format|
      #  format.json { render :json => @annotation}
      #end
  end

  def update
    @annotation = Annotation.find params[:id]
    geojson = params[:annotation]
    #if current_user.can_edit?(@annotation)
      Annotation.update(@annotation.id,
        :coordinates => geojson[:geometry][:coordinates],
        :text => geojson[:properties][:textContent],
        :style => geojson[:properties][:style]
      )
      render :file => 'annotations/update.json.erb', :content_type => 'application/json'
  end

  def destroy
    @annotation = Annotation.find params[:id]
    # if current_user.can_delete?(@annotation)
      @annotation.delete
      head :ok
    # end
  end

  def find_map
    @map = Map.find params[:map_id]
  end

end
