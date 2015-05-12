class UserGalleryBlocText < ActiveRecord::Base
  belongs_to :user_gallery
  has_many :tags, :as => :taggable, dependent: :destroy
  attr_accessible :bloc_text,  :user_gallery_id, :user_id
  trimmed_fields  :bloc_text
  include PublicActivity::Model
  tracked except: :update, owner: Proc.new{ |controller, model| controller.current_user }
  attr_accessor  :taglist, :whirls, :user_login, :user_whirled, :comment_cnt, :comments
  acts_as_votable
  acts_as_commentable

  def self.gather_bloc_texts(user_gallery_id)
    combined_block_texts = Array.new
    block_texts = UserGalleryBlocText.where(['user_gallery_id = ?', user_gallery_id])
    unless block_texts.blank? || block_texts.nil?
      block_texts.each do |block|
        blocktags =  block.tags.pluck([:name])
        block.taglist = blocktags
        user = User.find(block.user_id)
        block.user_login = user.login
        #get comments
        block = get_comment_stuff(model)
        #get whirls

        combined_block_texts << block
      end
    end
    return combined_block_texts
  end



end
