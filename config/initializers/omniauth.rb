Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2,
  ENV['36171865288-73du5g1a1ugameeccl2052qkpmerh0r0.apps.googleusercontent.com'],
  ENV['JdomduOn-gb7HSFm2nDYpOpI'], scope: 'userinfo.profile, youtube'
  OmniAuth.config.on_failure do |env|
    error_type = env['omniauth.error.type']
    new_path = "#{env['SCRIPT_NAME']}#{OmniAuth.config.path_prefix}/failure?message=#{error_type}"
    [301, {'Location' => new_path, 'Content-Type' => 'text/html'}, []]
  end
end
