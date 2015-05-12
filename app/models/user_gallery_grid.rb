
class UserGalleryGrid < ActiveRecord::Base
  serialize :grid_order
  belongs_to :user_gallery
  trimmed_fields :grid_text
  attr_accessible :grid_order, :user_gallery_id,:user_id, :grid_text
  has_many :photo_mods, as: :mod_gallery, dependent: :destroy
  has_many :tags, :as => :taggable, dependent: :destroy
  include PublicActivity::Model
  tracked except: :update, owner: Proc.new{ |controller, model| controller.current_user }
  acts_as_votable
  acts_as_commentable
  attr_accessor  :taglist, :photos, :whirls, :user_login, :user_whirled, :comment_cnt, :comments


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
        #get comments
        grid = get_comment_stuff(grid)
        #get whirls
        grid =  get_whirl_stuff(grid)
        #puts grid.photos
        combined_gallery_grids  << grid
      end
    end
    return combined_gallery_grids
  end


end
