import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

import ArticleCard from "@/components/articles/article-card";
import FeaturedArticle from "@/components/articles/featured-article";
import ReviewCard from "@/components/reviews/review-card";
import NewsletterForm from "@/components/newsletter/newsletter-form";
import CategoryFilter from "@/components/common/category-filter";

const Home = () => {
  const [category, setCategory] = useState("all");
  
  // Fetch featured article
  const {
    data: featuredArticle,
    isLoading: isFeaturedLoading
  } = useQuery({
    queryKey: ['/api/articles/featured'],
  });
  
  // Fetch latest articles
  const {
    data: articles,
    isLoading: isArticlesLoading
  } = useQuery({
    queryKey: [`/api/articles?limit=6&category=${category}`],
  });
  
  // Fetch featured reviews
  const {
    data: reviews,
    isLoading: isReviewsLoading
  } = useQuery({
    queryKey: ['/api/reviews?limit=4'],
  });
  
  return (
    <>
      {/* Hero/Featured Article Section */}
      <section className="relative overflow-hidden">
        <FeaturedArticle article={featuredArticle} isLoading={isFeaturedLoading} />
      </section>
      
      {/* Latest News Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-sans">Latest <span className="text-primary">News</span></h2>
            <CategoryFilter 
              selectedCategory={category} 
              onCategoryChange={setCategory} 
            />
          </div>
          
          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isArticlesLoading ? (
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
            ) : (
              articles?.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            )}
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/news">
              <Button className="bg-primary-900 hover:bg-primary-800 text-white font-medium">
                Load More News <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Reviews Section */}
      <section className="py-12 bg-primary-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold font-sans mb-8">Featured <span className="text-primary">Reviews</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isReviewsLoading ? (
              // Loading skeleton
              [...Array(4)].map((_, i) => (
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
            ) : (
              reviews?.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/reviews">
              <Button className="bg-primary-900 hover:bg-primary-800 text-white font-medium">
                View All Reviews <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <NewsletterForm />
    </>
  );
};

export default Home;
