class Photo < ActiveRecord::Base
  attr_accessible :photo_file, :user_gallery_id, :is_normal, :is_aerial, :user_id
  belongs_to :user_gallery
  has_many :photo_mods
  mount_uploader :photo_file, PhotoFileUploader
  # acts_as_votable
  include PublicActivity::Model
  #tracked owner: Proc.new{ |controller, model| controller.current_user }

  attr_accessor :whirls


  def self.make_warpable(photo)
    photo_dir = "#{Rails.root}/public/uploads/#{photo.class.to_s.underscore}/#{photo[:user_gallery_id]}/#{photo[:id]}"
    puts photo_dir
    file_path = photo_dir.to_s + "/"+ photo[:photo_file].to_s
    warpable =Warpable.new
    warp_file = File.open(file_path)
    warpable.image = warp_file
    warp_file.close
    gallery = UserGallery.find(photo[:user_gallery_id])
    warpable.map_id = gallery[:map_id]
    warpable.save!
    photo.warpable_id =    warpable.id
    photo.warpable_url =   warpable.image.url(:medium)
    photo.warpable_thumb_url =  warpable.image.url(:thumb)
    photo.save
    return photo
  end

  def self.deepLearnPredict(photo)
    photo_dir = "#{Rails.root}/public/uploads/#{photo.class.to_s.underscore}/#{photo[:user_gallery_id]}/#{photo[:id]}"
    #optional ability to filter certain image sizes
    #filtered_types = "thumb,medium"
    #cmd_line_args = " -f " + gallery_dir + " -i " + filtered_types + " -o " + gallery_dir
    path_to_predicter = "#{Rails.root}/zdeepLearn/predict.py"
    cmd =  'python ' + path_to_predicter+ " -f "+ photo_dir + " -o " + photo_dir
    result = system(cmd)
    if result
      normal_results = File.readlines(photo_dir+"/normal.txt")
      if normal_results.size > 0
        photo[:is_normal] = true
      end
      aerial_results = File.readlines(photo_dir+"/aerial.txt")
      if aerial_results.size > 0
        photo[:is_aerial] = true
      end
      photo.save
    else
      puts "job failed"
      photo[:is_normal] = true
      photo.save
    end
    path_to_faces = "#{Rails.root}/zdeepLearn/faces.py"
    faces_cmd =  'python ' + path_to_faces + " -f "+ photo_dir + " -o " + photo_dir
    puts faces_cmd
    fc_result = system(faces_cmd)
    if fc_result
      faces_results = File.readlines(photo_dir+"/faces.txt")
      if faces_results.size > 0
        puts "*****faces****"
        puts faces_results
        photo[:is_faces] = true
      end
      nofaces_results = File.readlines(photo_dir+"/nofaces.txt")
      if nofaces_results.size > 0
        puts "*****nofaces****"
        puts nofaces_results
        photo[:no_faces] = true
      end
      photo.save
    else
      puts "job failed"
      photo[:no_faces] = true
      photo.save
    end
    return photo
  end




end
