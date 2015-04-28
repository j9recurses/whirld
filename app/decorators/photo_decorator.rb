class PhotoDecorator < Draper::Decorator
  delegate_all

  def img_href
   "#{photo_file}"
  end


end
