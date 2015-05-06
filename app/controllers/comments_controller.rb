class CommentsController < ApplicationController


  #this method will work for both singular and threaded comments
  def comment
    klass_id = params[:klass_id]
    klass = Object.const_get params[:klass_type]
    klass_obj = klass.find( klass_id )
    if user_signed_in?
      if params[:title]
        @comment =  Comment.build_from(klass_obj, current_user.id, params[:comment], params[:title] )
      else
        @comment =  Comment.build_from(klass_obj, current_user.id, params[:comment] )
      end
      @comment.user_login = current_user.login
    end
    respond_to do |format|
      if user_signed_in?
        if @comment.save
          format.json { render json: @comment, :methods => [:commenter_login]}
        else
          format.json { render "Something went wrong! Could not save your comment." }
        end
      else
        format.json { render "You must be logged in to make comments." }
      end
    end
  end

  def threaded_comment
    klass_id = params[:klass_id]
    klass = Object.const_get params[:klass_type]
    klass_obj = klass.find( klass_id )
    if user_signed_in?
      @parent_comment =Comment.find(params[:parent_comment_id])
      if params[:title]
        @comment =  Comment.build_from(klass_obj, current_user.id, params[:comment], params[:title] )
      else
        @comment = Comment.build_from(klass_obj, current_user.id, params[:comment] )
      end
      @comment.user_login
    end
    respond_to do |format|
      if user_signed_in?
        if @comment.save
           @comment.move_to_child_of(@parent_comment)
          format.json { render json: @comment }
        else
          format.json { render "Something went wrong! Could not save your comment." }
        end
      else
        format.json { render "You must be logged in to make comments." }
      end
    end
  end

   def edit_comment
      @comment = Comment.find(params[:comment_id])
      @comment.body = params[:comment]
      if @comment.save
        render :json => @comment, :status => :ok
      else
        render :js => "alert('error deleting comment');"
      end
    end

  def delete_comment
      @comment = Comment.find(params[:id])
      unless @comment.nil?
      if @comment.destroy
        render :json => @comment, :status => :ok
      else
        render :js => "alert('error deleting comment');"
      end
    end
    end

end
