
class UserGalleryGrid < ActiveRecord::Base
  serialize :grid_order
  belongs_to :user_gallery
  belongs_to :map
  attr_accessible :grid_order, :user_gallery_id,:user_id
  has_many :photo_mods, as: :mod_gallery, dependent: :destroy
  has_many :tags, :as => :taggable, dependent: :destroy
  #include PublicActivity::Model
   #tracked owner: Proc.new{ |controller, model| controller.current_user }
  acts_as_votable
attr_accessor  :taglist, :photos, :whirls, :user_login


  def self.gather_gallery_grids(user_gallery_id)
    combined_gallery_grids = Array.new
    gallery_grids = UserGalleryGrid.where(['user_gallery_id = ?', user_gallery_id])
    unless gallery_grids.blank?
      gallery_grids.each do |grid|
        grid_tags  = Tag.gather_tag(grid)
        photos = PhotoMod.gather_mod_photos(grid.grid_photo_order)
        grid.photos = photos
        grid.taglist = grid_tags
        user = User.find(grid.user_id)
        grid.user_login = user.login
        puts grid.photos
        combined_gallery_grids  << grid
      end
    end
    return combined_gallery_grids
  end

 #  def taglist
 #    @taglist
 #  end

 #  def taglist=(val)
 #     @taglist = val
 #  end

 #  def photos
 #    @photos
 #  end

 #  def photos=(val)
 #    @photos = val
 #  end

 # def whirls
 #    @whirls
 #  end

 #  def whirls=(val)
 #    @whirls = val
 #  end

end
