class UserGalleryComparison < ActiveRecord::Base
  serialize :grid_order
  belongs_to :user_gallery
  attr_accessible :comparison_order, :user_gallery_id
  has_many :photo_mods, as: :mod_gallery, dependent: :destroy
  has_many :tags, :as => :taggable, dependent: :destroy
  include PublicActivity::Model
  tracked except: :update, owner: Proc.new{ |controller, model| controller.current_user }

  attr_accessor :taglist, :photos
  def taglist
    @taglist
  end

  def taglist=(val)
     @taglist = val
  end

  def photos
    @photos
  end

  def photos=(val)
    @photos = val
  end

  def self.gather_gallery_comparisions(user_gallery_id)
    combined_gallery_comps= Array.new
    gallery_comp = UserGalleryComparison.where(['user_gallery_id = ?', user_gallery_id])
    unless gallery_comp.blank? || gallery_comp.nil?
      gallery_comp.each do |comp|
        comp_tags  = Tag.gather_tag(comp)
        photos = PhotoMod.gather_mod_photos(comp.comparison_photo_order)
        #comp = comp.attributes
        comp.photos = photos
        comp.taglist = comp_tags
        combined_gallery_comps  << comp
      end
    end
    return combined_gallery_comps
  end
end
