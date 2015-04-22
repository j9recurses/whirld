json.array!([@user_gallery_text]) do |json,  user_gallery_text|
  json.id                           user_gallery_text.id
  json.user_gallery_id              user_gallery_text.user_gallery_id
  json.bloc_text       user_gallery_text.bloc_text
end
