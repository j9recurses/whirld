class UserGalleryComparison < ActiveRecord::Base
  serialize :grid_order
  belongs_to :user_gallery
  attr_accessible :comparison_order, :user_gallery_id, :user_id
  has_many :photo_mods, as: :mod_gallery, dependent: :destroy
  has_many :tags, :as => :taggable, dependent: :destroy
  include PublicActivity::Model
  tracked except: :update, owner: Proc.new{ |controller, model| controller.current_user }
  acts_as_votable
  acts_as_commentable
  attr_accessor  :taglist, :photos, :whirls, :user_login, :user_whirled, :comment_cnt, :comments

  def self.gather_gallery_comparisions(user_gallery_id)
    combined_gallery_comps= Array.new
    gallery_comp = UserGalleryComparison.where(['user_gallery_id = ?', user_gallery_id])
    unless gallery_comp.blank? || gallery_comp.nil?
      gallery_comp.each do |comp|
        comp_tags  = Tag.gather_tag(comp)
        photos = PhotoMod.gather_mod_photos(comp.comparison_photo_order)
        comp.photos = photos
        user = User.find(comp.user_id)
        comp.user_login = user.login
        #get comments
        comp = get_comment_stuff(comp)
        #get whirls
        comp =  get_whirl_stuff(comp)
        comp.taglist = comp_tags
        combined_gallery_comps  << comp
      end
    end
    return combined_gallery_comps
  end



end
