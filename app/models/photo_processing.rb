PhotoProcessing = Struct.new(:photo_class_name, :user_gallery_id, :photo_id) do
  def perform
    photo_dir = "#{Rails.root}/public/uploads/#{photo_class_name}/#{user_gallery_id}/#{photo_id}"
    filtered_types = "thumb,medium"
    #cmd_line_args = " -f " + gallery_dir + " -i " + filtered_types + " -o " + gallery_dir
    path_to_predicter = "/Users/j9/pyworkspace/deepLearnFinalProj/deepLearn/predict.py"
    cmd =  'python ' + path_to_predicter+ " -f "+ photo_dir +" -i " + filtered_types+ " -o " + photo_dir
    result = system(cmd)
    if result
      photo = Photo.find(photo_id)
      normal_results = File.readlines(photo_dir+"/normal.txt")
      if normal_results.size > 0
        puts "*****normal****"
        puts normal_results
        photo[:is_normal] = true
        photo.save
      end
      aerial_results = File.readlines(photo_dir+"/aerial.txt")
      if aerial_results.size > 0
        puts "*****aerial****"
        puts aerial_results
        photo[:is_aerial] = true
        photo.save
      end
      return photo
    else
      puts "job failed"
      return "error"
    end
  end

  def max_attempts
    1
  end

end
