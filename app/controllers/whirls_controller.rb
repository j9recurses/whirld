class WhirlsController < ApplicationController

  def whirl
    counter = 0
    klass_id = params[:klass_id]
    puts params[:klass_type]
    klass = Object.const_get params[:klass_type]
    @klass_obj = klass.find( klass_id )
    if user_signed_in?
      @klass_obj.liked_by current_user
      liked = current_user.like(@klass_obj)
      puts "*************"
      puts current_user.liked_maps.inspect
      @klass_obj.whirls =  @klass_obj.votes_for.size
    end
    respond_to do |format|
      if user_signed_in?
        format.json { render json: @klass_obj, :methods => [:whirls] }
      else
        format.json { render "You must be logged in to whirl items." }
      end
    end
  end


end
