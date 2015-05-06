 @annotation
json.artists @artists do |artist|
  json.(artist, :id, :name, :label)

 json.albums artist.albums do |album|
    json.(album, :id, :name)
  end
end


  json.type "feature"
  json.geometry do
    json.type @annotation.geometry_type
    json.coordinates @annotation.coordinates.to_json


   annotation.geometry do | geometry
    json.(geometry )

{
  "type": "Feature",
  "geometry": {
    "type": "<%= annotation.geometry_type %>",
    "coordinates": <%= annotation.coordinates.to_json %>
  },
  "properties": {
    "annotation_type": "<%= annotation.annotation_type %>",
    "id":     <%= annotation.id %>,
    "map_id": <%= annotation.map_id %>,
    "style":  <%= annotation.style.to_json %>,
    "textContent":   "<%= annotation.text %>",
    "url":    "<%= url_for([@map, annotation]) %>"
  }
}
