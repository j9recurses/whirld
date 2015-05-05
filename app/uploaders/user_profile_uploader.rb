
require 'carrierwave/processing/mime_types'
class UserProfileUploader < CarrierWave::Uploader::Base
 include CarrierWave::MiniMagick
  include CarrierWave::MimeTypes
  #process :store_dimensions
  #process :set_content_type
  #process :save_content_type_and_size_in_model

  storage :file
  # storage :fog

  def store_dir
    "#{Rails.root}/public/user_profile/#{model.id}"
  end

  version :thumb do
    process :resize_to_fill => [120, 120]
  end

  version :medium do
    process :resize_to_fit => [nil, 540]
  end




# def save_content_type_and_size_in_model
#     model.content_type = file.content_type if file.content_type
#     model.file_size = file.size
#   end


  def extension_white_list
    %w(jpg jpeg gif png)
  end

  # def store_dimensions
  #   if file && model
  #     model.width, model.height = ::MiniMagick::Image.open(file.file)[:dimensions]
  #   end
  # end



end
