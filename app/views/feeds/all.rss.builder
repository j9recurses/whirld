xml.instruct!

xml.rss "version" => "2.0", "xmlns:dc" => "http://purl.org/dc/elements/1.1/" do
 xml.channel do

   xml.title       "Recent maps at MapKnitter.org"
   xml.link        url_for :only_path => false, :controller => 'spectrums'
   xml.description "Recently posted maps at MapKnitter.org, a Public Laboratory open source research initiative"

   @maps.each do |map|
     xml.item do
       xml.title       map.name
       xml.author      map.author
       xml.image       map.warpables.first.image.url(:small) if map.warpables.length > 0
       xml.pubDate     map.created_at.to_s(:rfc822)
       xml.category    "mapknitter"
       xml.link        url_for :only_path => false, :controller => 'map', :action => 'view', :id => map.name
       xml.description "<iframe width='500px' height='400px' border='0' src='http://archive.publiclaboratory.org/leaflet/?tms=http://mapknitter.org/tms/"+map.name+"/&lon="+map.lon.to_s+"&lat="+map.lat.to_s+"&zoom=17'></iframe><br />"+map.description.to_s+"<br />View map details: http://mapknitter.org/map/view/"+map.name
       xml.guid        url_for :only_path => false, :controller => 'map', :action => 'view', :id => map.name
     end
   end

 end
end

