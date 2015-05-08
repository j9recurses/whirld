class UserGalleryBlocText < ActiveRecord::Base
  belongs_to :user_gallery
  has_many :tags, :as => :taggable, dependent: :destroy
  attr_accessible :bloc_text, :user_gallery_id
  include PublicActivity::Model
  tracked except: :update, owner: Proc.new{ |controller, model| controller.current_user }
  # acts_as_votable

  def self.gather_bloc_texts(user_gallery_id)
    combined_block_texts = Array.new
    block_texts = UserGalleryBlocText.where(['user_gallery_id = ?', user_gallery_id])
    block_texts.each do |block|
      blocktags =  block.tags.pluck([:name])
      block.taglist = blocktags
      combined_block_texts << block
    end
    return combined_block_texts
  end

  def whirls
    @whirls
  end

  def whirls=(val)
    @whirls = val
  end

  def taglist
    @taglist
  end

  def taglist=(val)
    @taglist = val
  end


end
