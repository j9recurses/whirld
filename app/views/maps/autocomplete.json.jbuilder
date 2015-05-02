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
end




