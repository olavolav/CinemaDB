# CinemaDB

Prototype application for movie listing and ratings.

![Screenshot of main movie listing page](https://github.com/olavolav/CinemaDB/raw/master/screenshot.jpg)

## Dependencies

- [Ruby 1.9](http://www.ruby-lang.org/)
- [Ruby on Rails 3](http://rubyonrails.org/)
- [elasticsearch](http://www.elasticsearch.org/)
- [Firefox](http://www.mozilla.org/firefox/) for integration testing

## Get started

- Install dependencies
- Launch elasticsearch
- Run `rake db:create`
- Run `rake db:seed` to set up database with default movie collection (optional)
- Launch Rails webserver via `rails server`
- Point your browser to [localhost:3000](http://localhost:3000)
