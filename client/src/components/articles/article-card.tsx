import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Share2, Bookmark } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Article } from "@shared/schema";

type ArticleCardProps = {
  article: Article;
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  const {
    id,
    title,
    summary,
    imageUrl,
    category,
    publishedAt,
    commentCount
  } = article;

  return (
    <Card className="article-card bg-primary-900 rounded-lg overflow-hidden border border-primary-800 hover:border-primary transition-all duration-300 h-full">
      <div className="relative">
        <img 
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-0 right-0 m-2">
          <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">{category}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950 to-transparent opacity-50 transition-opacity"></div>
      </div>

      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
          <Link href={`/article/${id}`}>
            <a>{title}</a>
          </Link>
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {summary}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{formatDate(publishedAt)}</span>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
              <MessageSquare size={16} />
              <span className="text-xs ml-1">{commentCount}</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
              <Share2 size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
              <Bookmark size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
