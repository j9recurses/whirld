# Load the rails application
require File.expand_path('../application', __FILE__)

require 'trimmer'
class ActiveRecord::Base
  include Trimmer
end

# Initialize the rails application
Whirld::Application.initialize!


