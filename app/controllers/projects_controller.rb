class ProjectsController < ApplicationController
  def resolve_layout
    case action_name

    when "index", "show"
      "layout_read"
    end
  end

	def new
	end
	def show

	end
end
