import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Share2, Bookmark, ArrowLeft } from "lucide-react";
import NewsletterForm from "@/components/newsletter/newsletter-form";

const Article = () => {
  const [match, params] = useRoute("/article/:id");
  const articleId = params?.id;
  
  const {
    data: article,
    isLoading,
    error
  } = useQuery({
    queryKey: [`/api/articles/${articleId}`],
    enabled: !!articleId,
  });
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/news">
          <Button className="bg-primary hover:bg-primary/90">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
          </Button>
        </Link>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-4 w-32 mb-8" />
        <Skeleton className="h-[400px] w-full mb-8" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-10" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-5/6 mb-4" />
      </div>
    );
  }
  
  if (!article) return null;
  
  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/news">
            <Button variant="ghost" className="text-muted-foreground hover:text-white pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
            </Button>
          </Link>
        </div>
        
        {/* Article header */}
        <header className="mb-8">
          <span className="inline-block bg-primary text-white text-sm font-bold px-3 py-1 rounded-md mb-3">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans leading-tight mb-4">
            {article.title}
          </h1>
          <div className="flex items-center justify-between">
            <time className="text-muted-foreground">{formatDate(article.publishedAt)}</time>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <MessageSquare size={18} className="mr-1" />
                <span>{article.commentCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Share2 size={18} />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Bookmark size={18} />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Featured image */}
        <figure className="mb-8">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full rounded-lg object-cover max-h-[600px]"
          />
        </figure>
        
        {/* Article content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12" 
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
        
        {/* Social sharing */}
        <div className="border-t border-primary-800 pt-6 mb-12">
          <div className="flex justify-between items-center">
            <div className="text-muted-foreground">
              Share this article
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-white">
                <Share2 size={16} className="mr-2" /> Share
              </Button>
              <Button variant="outline" size="sm" className="text-white">
                <MessageSquare size={16} className="mr-2" /> Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter */}
      <NewsletterForm />
    </>
  );
};

export default Article;
