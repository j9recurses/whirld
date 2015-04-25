
class MapPresenter
def initialize(map)
    @map = map
end

def taglist_show
  taglist = Array.new
    map[:taglist].each do | tag|
      tagstr = "<li class='tag item push-down'><a href='/'>#{tag}</a></li>"
      taglist << tagstr
    end
  map[:taglist] = taglist
end



 attr_reader :map

end
