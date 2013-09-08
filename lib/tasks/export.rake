namespace :export do
  # Exports movies in seed.rb format
  # Reference: http://ruby-auf-schienen.de/3.2/seed_rb.html
  desc "Prints all movies in a seeds.rb way."
  task :seeds_format => :environment do
    puts "# This file should contain all the record creation needed to seed the database with its default values."
    puts "# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup)."
    puts
    puts "# This file was created automatically using rake export:seeds_format"
    puts
    
    Movie.order(:id).all.each do |mov|
      reduced_info = mov.serializable_hash.delete_if do |key, value|
        ['created_at','updated_at','id','score_class'].include?(key)
      end
      puts "Movie.create(#{reduced_info.to_s.gsub(/[{}]/,'')})"
      puts
    end
  end
end
