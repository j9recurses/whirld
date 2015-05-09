json.array!([@maps]) do |json, map|
  json.name     map.name
  json.lat      map.lat
  json.lon    map.lon
  json.description map.description
  json.author map.author
  json.location map.location
  json.user_id  map.user
  json.slug     map.slug
  json.tags     map.tags
  json.coverphoto maps.coverphoto
  json.taglist  map.taglist
  json.coverphoto_name   map.coverphoto_name
  json.collaborator_list  map.collaborator_list
  json.search_order  map.search_order
  json.search_entity  map.search_entity
  json.geographic_search  map.geographic_search
  json.ndist   map.ndist
  json..whirls  map.whirls
  json.user_gallery_id    map.user_gallery_id
  json.omment_count   map.comment_count
end




