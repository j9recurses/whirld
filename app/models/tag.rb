class Tag < ActiveRecord::Base
  attr_accessible :name, :taggable_id, :taggable_type, :user_id
  belongs_to :taggable, :polymorphic => true,  touch: true
  validates_presence_of :name, :on => :create, :message => "can't be blank"
  include PublicActivity::Model
  tracked except: [:update, :delete], owner: Proc.new{ |controller, model| controller.current_user }

  def self.gather_tag(item)
    itemtags =  item.tags.pluck([:name])
    return itemtags
  end

end
