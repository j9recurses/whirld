 class UserGalleryBlocText < ActiveRecord::Base
  belongs_to :user_gallery
  has_many :tags, :as => :taggable, dependent: :destroy
  attr_accessible :bloc_text, :user_gallery_id

  def self.gather_bloc_texts(user_gallery_id)
    combined_block_texts = Array.new
    block_texts = UserGalleryBlocText.where(['user_gallery_id = ?', user_gallery_id])
    unless block_texts.blank?
      combined_block_texts = Tag.gather_tags(block_texts)
    end
   return combined_block_texts
  end

end
