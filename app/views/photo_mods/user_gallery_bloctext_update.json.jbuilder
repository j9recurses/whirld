
json.array!([ @user_gallery_bloc_txt) do |json,  user_gallery_bloc_txt|
 json.id                            user_gallery_bloc_txt.id
  json.user_gallery_id       user_gallery_bloc_txt.user_gallery_id
json.bloc               user_gallery_bloc_txt.bloc_text
end
