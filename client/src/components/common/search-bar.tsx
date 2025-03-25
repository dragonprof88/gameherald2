import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Link } from "wouter";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchResult } from "@/lib/types";

type SearchBarProps = {
  onClose: () => void;
};

const SearchBar = ({ onClose }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: searchResults,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: [`/api/search?q=${searchQuery}`],
    enabled: searchQuery.length > 2,
  });

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Close search results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    setShowResults(searchQuery.length > 2);
  }, [searchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="pb-4">
      <div className="relative">
        <div className="flex items-center">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for news, games, reviews..."
            className="w-full p-3 bg-primary-900 rounded-lg border border-primary-800 focus:border-primary outline-none text-white pr-20"
            value={searchQuery}
            onChange={handleSearch}
          />
          <div className="absolute right-0 flex items-center mr-2 space-x-1">
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-white" 
                onClick={clearSearch}
              >
                <X size={16} />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <Search size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Search Results */}
      {showResults && (
        <div className={`mt-2 bg-primary-900 rounded-lg border border-primary-800 shadow-lg max-h-[400px] overflow-y-auto`}>
          <div className="p-4">
            {isLoading || isFetching ? (
              // Loading state
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center p-2 rounded gap-3">
                  <Skeleton className="w-12 h-12 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-full mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))
            ) : searchResults?.length > 0 ? (
              // Results
              searchResults.map((result: SearchResult) => (
                <Link key={result.id} href={`/${result.type}/${result.id}`}>
                  <a className="flex items-center p-2 hover:bg-primary-800 rounded cursor-pointer">
                    <img 
                      src={result.imageUrl} 
                      alt={result.title} 
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="ml-3">
                      <h4 className="font-medium text-white">{result.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {result.category} • {formatDate(result.publishedAt)}
                      </p>
                    </div>
                  </a>
                </Link>
              ))
            ) : (
              // No results
              <div className="text-center py-6">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <p className="text-sm mt-1">Try different keywords or browse our categories</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
