
json.array!([@video]) do |json, video|
 json.id                           video.id
  json.user_gallery_id      video.user_gallery_id
   json.user_id         video.user_id
end
