class PhotoFileUploader < CarrierWave::Uploader::Base

  include CarrierWave::MiniMagick

  storage :file
  # storage :fog

  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  version :thumb do
    process :resize_to_fill => [120, 120]
  end

  version :medium do
    process :resize_to_fit => [nil, 540]

  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end



end
