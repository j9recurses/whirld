class UserGallerySplit < ActiveRecord::Base
  belongs_to :user_gallery
  attr_accessible :split_text, :user_gallery_id
  has_many :photo_mods, as: :mod_gallery, dependent: :destroy
  has_many :tags, :as => :taggable, dependent: :destroy

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

  def self.gather_gallery_splits(user_gallery_id)
    combined_gallery_splits= Array.new
    gallery_splits = UserGallerySplit.where(['user_gallery_id = ?', user_gallery_id])
    unless gallery_splits.blank? || gallery_splits.nil?
      gallery_splits.each do |split|
        split_tags  = Tag.gather_tag(split)
        photos = PhotoMod.gather_mod_photo("UserGallerySplit", split.id)
        split.photos = photos
        split.taglist = split_tags
        combined_gallery_splits  << split
      end
    end
    return combined_gallery_splits
  end
end
