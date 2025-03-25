import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Article } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

type FeaturedArticleProps = {
  article?: Article;
  isLoading?: boolean;
};

const FeaturedArticleSkeleton = () => (
  <div className="relative h-[500px] md:h-[600px]">
    <div className="absolute inset-0 bg-gradient-to-t from-primary-950 to-transparent z-10"></div>
    <Skeleton className="w-full h-full" />
    
    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20">
      <div className="container mx-auto">
        <Skeleton className="h-6 w-32 mb-3" />
        <Skeleton className="h-12 w-full max-w-3xl mb-2" />
        <Skeleton className="h-8 w-full max-w-3xl mb-4" />
        <div className="flex items-center">
          <Skeleton className="h-5 w-32 mr-4" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  </div>
);

const FeaturedArticle = ({ article, isLoading = false }: FeaturedArticleProps) => {
  if (isLoading || !article) {
    return <FeaturedArticleSkeleton />;
  }

  return (
    <div className="relative h-[500px] md:h-[600px]">
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950 to-transparent z-10"></div>
      <img 
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20">
        <div className="container mx-auto">
          <span className="inline-block bg-primary text-white text-sm font-bold px-3 py-1 rounded-md mb-3">{article.category}</span>
          <h1 className="text-3xl md:text-5xl font-bold font-sans text-white leading-tight mb-2">
            {article.title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 mb-4 max-w-3xl">
            {article.summary}
          </p>
          <div className="flex items-center">
            <span className="text-muted-foreground mr-4">{formatDate(article.publishedAt)}</span>
            <Link href={`/article/${article.id}`}>
              <Button className="flex items-center text-white bg-accent hover:bg-accent-foreground transition-colors">
                <span>Read More</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;
