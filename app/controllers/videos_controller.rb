
class VideosController < ApplicationController

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
    end

    def index
      @videos = Video.all
    end

    def get_video_uid
      video_uid = params[:id]
      v = current_user.videos.build(uid: video_uid)
      youtube = YouTubeIt::OAuth2Client.new(dev_key: ENV['AIzaSyDZ4iVBOZ4m6jkZzZJSn7IHmLaBdGhUX0s'])
      yt_video = youtube.video_by(video_uid)
      v.title = yt_video.title
      v.description = yt_video.description
      v.save
      flash[:success] = 'Thanks for sharing your video!'
      redirect_to root_url
    end

    def get_upload_token
      temp_params = { title: params[:title], description: params[:description], category: 'Education',
                      keywords: [] }

      if current_user
        youtube = YouTubeIt::OAuth2Client.new(client_access_token: current_user.token,
                                              dev_key: ENV['GOOGLE_DEV_KEY'])

        upload_info = youtube.upload_token(temp_params, get_video_uid_url)

        render json: {token: upload_info[:token], url: upload_info[:url]}
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
