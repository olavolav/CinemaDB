module MoviesHelper
  
  def category_options_array
    # Collect an array of names and ids of categories for the dropdown box in forms
    return Category.possible_categories.collect{ |c| [c.to_s, c.to_i] }
  end
  
  def category_filter_list_JS
    full_hash = Hash.new
    full_hash['All genres'] = -1
    Category.possible_categories.each{|cat| full_hash[cat.to_s] = cat.to_i}
    return full_hash.collect do |title, value|
      "{name: '#{title}', value: #{value}}"
    end.join(", ").html_safe
  end
  
  def years_filter_list_JS(y_start, y_end)
    full_hash = Hash.new
    full_hash['All years'] = -1
    (y_start..y_end).each{|y| full_hash[y.to_s] = y}
    return full_hash.collect do |title, value|
      "{name: '#{title}', value: #{value}}"
    end.join(", ").html_safe
  end
  
  def scores_filter_list_JS(s_start, s_end)
    full_hash = Hash.new
    full_hash['All scores'] = -1
    (s_start..s_end).each{|s| full_hash["#{pluralize s, 'star'}"] = s}
    return full_hash.collect do |title, value|
      "{name: '#{title}', value: #{value}}"
    end.join(", ").html_safe
  end
  
  def score_class_stars(sc)
    return "\u2605"*sc.to_i + "\u2606"*(5 - sc.to_i)
  end
  
end
