# config valid only for Capistrano 3.1

set :application, 'whirld'
set :repo_url, 'https://github.com/j9recurses/whirld.git'
set :deploy_to, '/home/deploy/whirld'
set :linked_files, %w{config/database.yml}
#file dirs that you need like log and cache and public, cap won't recreate these everytime
#set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system public/images public/user_profile public/uploads}
#add extra dirs for all the photos
#Aset :linked_dirs, fetch(:linked_dirs) + %w{public/system public/uploads}+  %w{public/system public/images} +  %w{public/system public/user_profile}
set :linked_dirs, fetch(:linked_dirs, []).push('bin', 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/uploads', 'public/user_profile', 'public/images')



set :ssh_options ,{ keys:  %w('~/.ssh/id_rsa.pub') }

namespace :deploy do
  after :finishing, 'deploy:cleanup'

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :publishing, 'deploy:restart'
  after :finishing, 'deploy:cleanup'
end




# Default value for keep_releases is 5
# set :keep_releases, 5


# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }

# Default deploy_to directory is /var/www/my_app
# set :deploy_to, '/var/www/my_app'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

