json.array!([@photo]) do |json, photo|
  json.name            	photo.photo_file
  json.size            	photo.photo_file.size
  json.current_path  		photo.photo_file.current_path
  json.url           		photo.photo_file.url
  json.thumbnail_url   	photo.photo_file.url(:thumb)
  if photo.is_aerial
    json.photo_type       "aerial"
  end
  if photo.is_normal
    json.photo_type       "normal"
  end
  json.warpable_id    photo.warpable_id
  json.warpable_url   photo.warpable_url
  json.warpable_thumb_url  photo.warpable_thumb_url
end
