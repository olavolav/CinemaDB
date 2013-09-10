# CinemaDB

Prototype application for movie listing and ratings.

![Screenshot of main movie listing page](https://github.com/olavolav/CinemaDB/raw/master/screenshot.png)


## Dependencies

- [Ruby 1.9](http://www.ruby-lang.org/)
- [Ruby on Rails 3](http://rubyonrails.org/)
- [elasticsearch](http://www.elasticsearch.org/)
- [Firefox](http://www.mozilla.org/firefox/) for integration testing

## Get started

- Install dependencies
- Create the YAML file `config/secrets.yml`. Currently the only entry in there is the [secret token of Rails](http://guides.rubyonrails.org/security.html#session-storage), so write `RAILS_SECRET_TOKEN: '38518ee838f'`.
Needless to say, one should replace the argument with a random, and much longer token.
- Launch elasticsearch
- Run `rake db:create`
- Run `rake db:seed` to set up database with default movie collection (optional)
- Launch Rails webserver via `rails server`
- Point your browser to [localhost:3000](http://localhost:3000)
