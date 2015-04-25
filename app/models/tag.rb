class Tag < ActiveRecord::Base
   attr_accessible :name, :taggable_id, :taggable_type, :user_id
  belongs_to :taggable, :polymorphic => true
  validates_presence_of :name, :on => :create, :message => "can't be blank"

  def self.gather_tags(items)
    combined_items = Array.new
    items.each do |item|
    itemtags =  item.tags.pluck([:name])
       itemh = item.attributes
       itemh[:taglist] = itemtags
      combined_items << itemh
    end
    return combined_items
  end

  def self.gather_tag(item)
    itemtags =  item.tags.pluck([:name])
    itemh = item.attributes
    itemh[:taglist] = itemtags
    return itemh
  end
end
