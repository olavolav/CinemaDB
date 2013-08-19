class AddScoreClassToMovies < ActiveRecord::Migration
  def change
    add_column :movies, :score_class, :integer
  end
end
