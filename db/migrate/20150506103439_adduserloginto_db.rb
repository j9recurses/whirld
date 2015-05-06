class AdduserlogintoDb < ActiveRecord::Migration
  def up
     add_column :comments, :user_login, :string
  end

  def down
      remove_column :comments, :user_login, :string
  end
end
