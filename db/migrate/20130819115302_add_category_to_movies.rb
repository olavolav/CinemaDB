class AddCategoryToMovies < ActiveRecord::Migration
  def change
    add_column :movies, :category_id, :integer, :default => 0
  end
end
