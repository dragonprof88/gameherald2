import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/types";

type CategoryFilterProps = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="relative">
      <Select 
        value={selectedCategory} 
        onValueChange={onCategoryChange}
      >
        <SelectTrigger className="w-[180px] bg-primary-900 border-primary-800 text-white">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent className="bg-primary-900 border-primary-800 text-white">
          {CATEGORIES.map((category) => (
            <SelectItem 
              key={category.id} 
              value={category.id}
              className="hover:bg-primary-800 focus:bg-primary-800"
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryFilter;
