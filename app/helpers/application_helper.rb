module ApplicationHelper



  # add this to app/helpers/application_helper.rb
  # http://www.emersonlackey.com/article/rails3-error-messages-for-replacemen
  def errors_for(object, message=nil)
    html = ""
    unless object.nil? || object.errors.blank?
      html << "<div class='alert alert-error #{object.class.name.humanize.downcase}Errors'>\n"
      if message.blank?
        if object.new_record?
          html << "\t\t<h5>There was a problem creating the #{object.class.name.humanize.downcase}</h5>\n"
        else
          html << "\t\t<h5>There was a problem updating the #{object.class.name.humanize.downcase}</h5>\n"
        end
      else
        html << "<h5>#{message}</h5>"
      end
      html << "\t\t<ul>\n"
      object.errors.full_messages.each do |error|
        html << "\t\t\t<li>#{error}</li>\n"
      end
      html << "\t\t</ul>\n"
      html << "\t</div>\n"
    end
    html
  end

  #parse the tags in the form, see if they exist; if not create then,  or delete tags no longer in tagging list
  def parse_taglist(taglist, mod_type, mod_gallery_id)
    if mod_type == "grid"
      item = UserGalleryGrid.find(mod_gallery_id)
    elsif mod_type.eql?("comparison")
      item = UserGalleryComparison.find(mod_gallery_id)
    elsif mod_type.eql?("split")
      item = UserGallerySplit.find(mod_gallery_id)
    elsif mod_type.eql?("text")
      item = UserGalleryBlocText.find(mod_gallery_id)
    elsif mod_type.eql?("map")
      item = Map.find(mod_gallery_id)
     elsif mod_type.eql?("user_profile")
      item = UserProfile.find(mod_gallery_id)
    end
    unless taglist.nil?
      newtaglist =  taglist.split(",")
      modtag_ids = item.tags.pluck(:id)
      unless modtag_ids.blank?
        Tag.destroy(modtag_ids)
      end
      newtaglist.each do |tag|
        item.tags.create(name: tag, user_id:current_user[:id])
      end
      #item[:taglist] = item.tags
      item.taglist =item.tags
    end
    return item
  end



  def arrange_modules(mod_order)
    unless mod_order.blank?
      mod_order =  mod_order.gsub("{", "[")
      mod_order =  mod_order.gsub("}", "]")
      mod_order =  mod_order.gsub(":", ",")
      mod_order = eval(mod_order)
    end
    return mod_order
  end




  # polyfill for jquery-ujs in rails 2.x
  # see https://github.com/rails/jquery-ujs/wiki/Manual-installing-and-Rails-2

end
