class ProjectsController < ApplicationController
  layout :resolve_layout
  def resolve_layout
    case action_name

    when "index", "show"
      "application"
    end
  end

	def new
	end
	def show
    resolve_layout
	end
end
