
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


def upload_map_images(filedir, images, maps)
  maps.each do |map|
    images.each do |image|
      photo = Photo.new
      photo.user_id = map.user_id
      ug = map.user_galleries[0].id
      photo.user_gallery_id = ug
      fn = File.join(Rails.root, filedir, image).to_s
      File.open(fn) do |f|
        photo.photo_file = f
        photo.save
      end
    end
  end
end

def make_gallery_grids(maps)
  maps.each do |map|
    ug_id = map.user_galleries[0].id
    user_gallery_grids = UserGalleryGrid.where(['user_gallery_id = ?', ug_id])
    photos = Photo.where(["user_gallery_id = ?", ug_id]).pluck(:id)
    user_gallery_grids.each do |grid|
      grid_photo_order = ""
      photos.each do |photo|
        photo_mod = PhotoMod.new
        photo_mod.photo_id = photo
        photo_mod.mod_gallery_id = grid.id
        photo_mod.mod_gallery_type = "UserGalleryGrid"
        photo_mod.save
        grid_photo_order = grid_photo_order +  photo.to_s + ","
      end
      grid_photo_order = grid_photo_order[0...-1]
       grid.grid_photo_order  = grid_photo_order
      grid.save
    end
  end
end

def map_module_order(maps)
  maps.each do |map|
    mod_order_list = Array.new
    ug_id = UserGallery.where(["map_id = ?", map.id])
    user_gallery_grid_ids = UserGalleryGrid.where(['user_gallery_id = ?', ug_id.id]).pluck([:id])
    order_list = Array.new
   user_gallery_grid_ids.each do | grid|
      grid_item = [grid, "grid"]
      order_list << grid_item
    end
    puts ug_id.inspect
    ug_id.module_order = mod_order_list
    ug_id.save
  end
end





####main#######
filedir = "app/assets/images/test/faker"
userprofile_image =  "cat.png"
maps_coverphoto_img = 'teagarden.jpg'
images = ['grid-02.jpg', 'grid-04.jpg',  'grid-06.jpg', 'grid-09.png', 'grid-10.png', 'teagarden.jpg']
maps = Map.all
users = User.all
get_profile_pics(users, filedir, userprofile_image)
get_collabos(maps, users)
coverphoto_maps(maps, filedir, maps_coverphoto_img)
upload_map_images(filedir, images, maps)
make_gallery_grids(maps)
map_module_order(maps)
