Jekyll::Hooks.register :site, :pre_render do |site|
  # Get all posts that are NOT in the 'creative' category
  noncreative_posts = site.posts.docs.reject do |post|
    Array(post.data["categories"]).include?("creative")
  end

  site.collections["noncreative"].docs = noncreative_posts
end