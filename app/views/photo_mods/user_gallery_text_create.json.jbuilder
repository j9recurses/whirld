
json.array!([@user_gallery_text]) do |json,  user_gallery_text|
  json.id                          user_gallery_text.id
  json.user_gallery_id              user_gallery_text.user_gallery_id
  json.comparison_photo_order      user_gallery_text.grid_photo_order
  json.user_id                     user_gallery_text.user_id
end
