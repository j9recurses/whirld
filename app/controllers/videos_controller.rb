
class VideosController < ApplicationController
  before_filter :authenticate_user!,  :except => [:index, :show, :images]


  def create
    @video = Video.new(params[:video])
    if @video.save
      flash[:success] = 'Video added!'
      redirect_to root_url
    else
      render 'new'
    end
  end

    def new
      @pre_upload_info = {}
      puts "in here!"
    end

    def index
      @videos = Video.all
    end

    def get_video_uid
      video_uid = params[:id]
      puts "in here!!!"
      youtubeuser = YoutubeUser.find(id: session[:youtube_user_id])
      v = youtubeuser.videos.build(uid: video_uid)
      youtube = YouTubeIt::OAuth2Client.new(dev_key:'AIzaSyDZ4iVBOZ4m6jkZzZJSn7IHmLaBdGhUX0s')
      yt_video = youtube.video_by(video_uid)
      v.title = yt_video.title
      v.description = yt_video.description
      v.save
      flash[:success] = 'Thanks for sharing your video!'
      redirect_to root_url
    end

    def videos_get_upload_token
      temp_params = { title: params[:title], description: params[:description], category: 'Education',
                      keywords: [] }
      unless session[:youtube_user_id].nil?
        youtube = YouTubeIt::OAuth2Client.new(client_access_token: session[:youtube_user_token],
                                              dev_key:'AIzaSyDZ4iVBOZ4m6jkZzZJSn7IHmLaBdGhUX0s')

        upload_info = youtube.upload_token(temp_params, get_video_uid_path)

        render json: {token: upload_info[:token], url: upload_info[:url]}
        puts "********"
        puts upload_info.inspect
      else
        render json: {error_type: 'Not authorized.', status: :unprocessable_entity}
      end
    end


    def add_comment
      @video = Video.find(params[:id])
      if @video.create_comment(params[:video][:comment])
        flash[:notice] = "Comment has been sucessfully added."
      else
        flash[:error] = "Sorry the comment has not been added."
      end
      redirect_to @video
    end


end
