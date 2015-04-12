# This migration comes from acts_as_taggable_on_engine (originally 1)
class ActsAsTaggableOnMigration < ActiveRecord::Migration
  def self.up
    drop_table :tags
    create_table :tags do |t|
      t.string :name
      t.string   :user_id
      t.string   :name
      t.integer  :map_id
      t.integer  :warpable_id
      t.datetime :created_at
      t.datetime :updated_at
    end

    add_index "tags", ["map_id"], :name => "index_tags_on_map_id"
    add_index "tags", ["user_id"], :name => "index_tags_on_user_id"
    add_index "tags", ["warpable_id"], :name => "index_tags_on_warpable_id"


    create_table :taggings do |t|
      t.references :tag

      # You should make sure that the column created is
      # long enough to store the required class names.
      t.references :taggable, polymorphic: true
      t.references :tagger, polymorphic: true

      # Limit is created to prevent MySQL error on index
      # length for MyISAM table type: http://bit.ly/vgW2Ql
      t.string :context, limit: 128

      t.datetime :created_at
    end

    add_index :taggings, :tag_id
    add_index :taggings, [:taggable_id, :taggable_type, :context]
  end

  def self.down
    drop_table :taggings
    drop_table :tags
  end
end
