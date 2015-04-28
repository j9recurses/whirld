class TagDecorator < Draper::Decorator
  delegate_all

def tag_li
  "<li class='project-tag item push-down'><a href='/'>#{object}</a></li>"
  end

end
