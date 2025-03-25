import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import ArticleCard from "@/components/articles/article-card";
import CategoryFilter from "@/components/common/category-filter";

const News = () => {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(useSearch());
  const initialCategory = searchParams.get("category") || "all";
  
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  
  // Fetch articles
  const {
    data: articles,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: [`/api/articles?category=${category}`],
  });
  
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
    
    // Update URL
    setLocation(`/news${newCategory !== 'all' ? `?category=${newCategory}` : ''}`, {
      replace: true
    });
  };
  
  const displayedArticles = articles?.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = articles && displayedArticles.length < articles.length;
  
  const loadMore = () => {
    setPage(page + 1);
  };
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">Latest Gaming News</h1>
          <p className="text-muted-foreground max-w-3xl">
            Stay up to date with the latest news, releases, and updates from the gaming industry. 
            From new game announcements to hardware releases and developer insights.
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <h2 className="text-xl font-bold mr-4">Browse News</h2>
            <CategoryFilter 
              selectedCategory={category} 
              onCategoryChange={handleCategoryChange} 
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            {!isLoading && articles && (
              <span>Showing {displayedArticles?.length || 0} of {articles.length} articles</span>
            )}
          </div>
        </div>
        
        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-full">
                <Skeleton className="h-48 w-full mb-4 rounded-t-lg" />
                <div className="p-4">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : displayedArticles?.length > 0 ? (
            displayedArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground mb-4">No articles found in this category.</p>
              <Button 
                variant="outline" 
                onClick={() => handleCategoryChange("all")}
              >
                View All Categories
              </Button>
            </div>
          )}
        </div>
        
        {hasMore && (
          <div className="mt-8 text-center">
            <Button 
              className="bg-primary-900 hover:bg-primary-800 text-white font-medium"
              onClick={loadMore}
              disabled={isFetching}
            >
              {isFetching ? "Loading..." : "Load More Articles"} 
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default News;
