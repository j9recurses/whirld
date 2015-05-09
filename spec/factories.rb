FactoryGirl.define do
  password = "password"


  factory :user do
    email { Faker::Internet.free_email }
    password { Faker::Internet.password(8) }
    encrypted_password = { password => password}
    login { Faker::Internet.user_name }
    last_sign_in_ip {Faker::Internet.ip_v4_address}
    sign_in_count { 3}
  end

  factory :photo do
     photo_file{ Rack::Test::UploadedFile.new(File.join(Rails.root, "app", "assets", "images", "test", "teagarden.jpg")) }
  end

  factory :map do
      name {Faker::Lorem.word+Faker::Commerce.color}
      slug { Faker::Lorem.word+Faker::Commerce.color}
  end

  factory :user_with_photo_and_map do
    after(:create) do |user|
      create(:photo, user_id: user)
      create(:map, user_id: user)
    end
  end

end
#user.encrypted_password = User.new(:password => password).encrypted_password

