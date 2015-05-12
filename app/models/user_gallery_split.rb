class UserGallerySplit < ActiveRecord::Base
  belongs_to :user_gallery
  trimmed_fields :split_text
  attr_accessible :split_text, :user_gallery_id, :user_id
  has_many :photo_mods, as: :mod_gallery, dependent: :destroy
  has_many :tags, :as => :taggable, dependent: :destroy
  include PublicActivity::Model
  tracked except: :update, owner: Proc.new{ |controller, model| controller.current_user }
  acts_as_votable
  acts_as_commentable

  attr_accessor :whirls, :taglist, :user_login, :photos, :user_whirled, :comment_cnt, :comments


  def self.gather_gallery_splits(user_gallery_id)
    combined_gallery_splits= Array.new
    gallery_splits = UserGallerySplit.where(['user_gallery_id = ?', user_gallery_id])
    unless gallery_splits.blank? || gallery_splits.nil?
      gallery_splits.each do |split|
        split_tags  = Tag.gather_tag(split)
        photos = PhotoMod.gather_mod_photo("UserGallerySplit", split.id)
        split.photos = photos
        split.taglist = split_tags
        user = User.find(split.user_id)
        split.user_login = user.login
        #get comments
        split = get_comment_stuff(split)
        #get whirls
        split =  get_whirl_stuff(split)
        combined_gallery_splits  << split
      end
    end
    return combined_gallery_splits
  end



end
