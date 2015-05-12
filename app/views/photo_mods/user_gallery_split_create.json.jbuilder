
json.array!([@user_gallery_split]) do |json, user_gallery_split|
 json.id                           user_gallery_split.id
  json.user_gallery_id      user_gallery_split.user_gallery_id
  json.split_text          user_gallery_split.split_text
   json.user_id         user_gallery_split.user_id
end
