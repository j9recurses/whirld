##Whirld


Whirld is an extension of the Public Lab's Mapknitter software. It allows you
to upload photos and and combine them into:

* web "slippy maps" like Google Maps
* GeoTiff
* TMS
* high resolution JPEG
* plus much much more!

##Prerequisites

Recommended; for an Ubuntu/Debian system. Varies slightly for mac/fedora/etc

Install a database, if necessary. sqlite does not seem to work due to some table constraints.

`sudo apt-get install mysql-server`

Application-specific dependencies:

`sudo apt-get install bundler libmysqlclient-dev imagemagick ruby-rmagick libfreeimage3 libfreeimage-dev ruby-dev libmagickcore-dev libmagickwand-dev`

(optional) For exporting, you'll need GDAL >=1.7.x (gdal.org), as well as `curl` and `zip`-- but these are not needed for much of development, unless you're working on the exporting features.

`sudo apt-get install gdal-bin python-gdal curl libcurl4-openssl-dev libssl-dev zip`

Install rvm for Ruby management (http://rvm.io)

`curl -L https://get.rvm.io | bash -s stable`

**Note:** At this point during the process, you may want to log out and log back in, or open a new terminal window; RVM will then properly load in your environment.

**Ubuntu users:** You may need to enable `Run command as a login shell` in Ubuntu's Terminal, under Profile Preferences > Title and Command. Then close the terminal and reopen it.

Then, use RVM to install version 2.1.2 of Ruby:

`rvm install 2.1.2`

You'll also need **bower** which is available through NPM. To install NPM, you can run:

`sudo apt-get install npm`

However, on Ubuntu, you may need to also install the `nodejs-legacy` package, as due to a naming collision, some versions of Ubuntu already have an unrelated package called `node`. To do this, run:

`sudo apt-get install nodejs-legacy`

Once NPM is installed, you should be able to run:

`sudo npm install -g bower`

##Installation

You'll need at least Ruby v1.9.3 (**v2.1.x** preferred)

1. Download a copy of the source with git clone
2. Install gems with `bundle install` from the rails root folder. You may need to run `bundle update` if you have older gems in your environment.
3. Create a mysql user called 'myrailsbuddy' that has the password, 'mypass'
5. Initialize database with `bundle exec rake db:setup`
7. Install static assets (like external javascript libraries, fonts) with `bower install` .
8. Start rails with `bundle exec passenger start` from the Rails root and open http://localhost:3000 in a web browser.
