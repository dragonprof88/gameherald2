import { Card, CardContent } from "@/components/ui/card";
import { formatDate, generateStarRating } from "@/lib/utils";
import { Link } from "wouter";
import { Review } from "@shared/schema";
import { Star, StarHalf } from "lucide-react";

type ReviewCardProps = {
  review: Review;
};

const ReviewCard = ({ review }: ReviewCardProps) => {
  const {
    id,
    title,
    summary,
    imageUrl,
    category,
    rating,
    publishedAt,
    author
  } = review;

  // Convert rating (0-100) to stars
  const stars = generateStarRating(rating);

  return (
    <Card className="bg-primary-900 rounded-lg overflow-hidden border border-primary-800 hover:border-primary transition-colors h-full">
      <div className="relative">
        <img 
          src={imageUrl}
          alt={title}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <div className="flex items-center">
            <div className="bg-accent text-white text-lg font-bold w-10 h-10 flex items-center justify-center rounded-md">
              {(rating / 10).toFixed(1)}
            </div>
            <div className="ml-2 flex">
              {/* Full stars */}
              {[...Array(stars.full)].map((_, i) => (
                <Star key={`full-${i}`} className="text-primary fill-primary" size={16} />
              ))}
              
              {/* Half star */}
              {stars.half > 0 && (
                <StarHalf className="text-primary fill-primary" size={16} />
              )}
              
              {/* Empty stars */}
              {[...Array(stars.empty)].map((_, i) => (
                <Star key={`empty-${i}`} className="text-primary" size={16} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <span className="inline-block bg-primary-800 text-neutral-200 text-xs px-2 py-1 rounded mb-2">{category}</span>
        <h3 className="text-lg font-bold mb-1 hover:text-primary transition-colors">
          <Link href={`/review/${id}`}>
            <a>{title}</a>
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {summary}
        </p>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>By {author}</span>
          <span>{formatDate(publishedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
