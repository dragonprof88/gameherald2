import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import ReviewCard from "@/components/reviews/review-card";
import CategoryFilter from "@/components/common/category-filter";

const Reviews = () => {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(useSearch());
  const initialCategory = searchParams.get("category") || "all";
  
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  
  // Fetch reviews
  const {
    data: reviews,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: [`/api/reviews?category=${category}`],
  });
  
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
    
    // Update URL
    setLocation(`/reviews${newCategory !== 'all' ? `?category=${newCategory}` : ''}`, {
      replace: true
    });
  };
  
  const displayedReviews = reviews?.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = reviews && displayedReviews.length < reviews.length;
  
  const loadMore = () => {
    setPage(page + 1);
  };
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">Game Reviews</h1>
          <p className="text-muted-foreground max-w-3xl">
            Expert reviews of the latest game releases across all platforms. 
            Find out what's worth playing and what to skip with our comprehensive ratings and analysis.
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <h2 className="text-xl font-bold mr-4">Browse Reviews</h2>
            <CategoryFilter 
              selectedCategory={category} 
              onCategoryChange={handleCategoryChange} 
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            {!isLoading && reviews && (
              <span>Showing {displayedReviews?.length || 0} of {reviews.length} reviews</span>
            )}
          </div>
        </div>
        
        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeleton
            [...Array(8)].map((_, i) => (
              <div key={i} className="h-full">
                <Skeleton className="h-44 w-full mb-4 rounded-t-lg" />
                <div className="p-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))
          ) : displayedReviews?.length > 0 ? (
            displayedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground mb-4">No reviews found in this category.</p>
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
              {isFetching ? "Loading..." : "Load More Reviews"} 
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
