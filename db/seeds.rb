
#populate a user profile photos
def get_collabos(maps, users)
  maps.each do |map|
    users.each do |user|
      collab = Collaborator.new
      collab.user_id = user.id
      collab.map_id = map.id
      collab.save
    end
  end
end

def upload_file(filedir, image, klass_obj)
  fn = File.join(Rails.root, filedir, image).to_s
  File.open(fn) do |f|
    klass_obj.photo_file = f
    klass_obj.save
  end
end

def get_profile_pics(users, filedir, image)
  users.each do |user|
    up = user.user_profile
    upload_file(filedir, image, up)
  end
end

def coverphoto_maps(maps, filedir, image)
  maps.each do |map|
    photo = Photo.new
    photo.user_id = map.user_id
    ug = map.user_galleries[0].id
    photo.user_gallery_id = ug
    upload_file(filedir, image, photo)
  end
end




####main#######
filedir = "app/assets/images/test/"
userprofile_image =  "cat.png"
maps_coverphoto_img = 'teagarden.jpg'

maps = Map.all
users = User.all
get_profile_pics(users, filedir, userprofile_image)
get_collabos(maps, users)
coverphoto_maps(maps, filedir, maps_coverphoto_img)
##collaborators
