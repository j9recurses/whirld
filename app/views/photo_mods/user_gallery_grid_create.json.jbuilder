
json.array!([@user_gallery_grid]) do |json, user_gallery_grid|
  json.id                           user_gallery_grid.id
  json.user_gallery_id              user_gallery_grid.user_gallery_id
  json.grid_photo_order             user_gallery_grid.grid_photo_order
   json.user_id                     user_gallery_grid.user_id
end
