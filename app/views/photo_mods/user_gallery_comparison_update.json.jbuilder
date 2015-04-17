
json.array!([@user_gallery_comparison]) do |json, user_gallery_comparison|
  json.id                           user_gallery_comparison.id
  json.user_gallery_id              user_gallery_comparison.user_gallery_id
  json.comparison_photo_order      user_gallery_comparisond.grid_photo_order
end
