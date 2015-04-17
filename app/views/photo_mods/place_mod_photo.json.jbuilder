
json.array!([@photo_mod) do |json, photo_mod|
 json.id                          photo_mod.id
  json.user_gallery_id      photo_mod.photo_id
  json.split_text       photo_mod.caption
   json.split_text     photo_mod.mod_gallery
    json.split_text     photo_mod.mod_type
end
