import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import React from "react";

const CategoryCard = ({ category }) => {
  const router = useRouter();
  const handleEventClick = (category) => {
    router.push(`/explore/${category}`);
  };

  return (
    <Card
      key={category.id}
      className={
        "py-2 group cursor-pointer hover:shadow-lg hover:shadow-purple-500/10 transition-all hover:border-purple-500/50"
      }
      onClick={() => handleEventClick(category.id)}
    >
      <CardContent className="px-3 sm:p-6 flex items-center gap-3">
        <div className="text-3xl sm:text-4xl scale-70 group-hover:scale-115 transition-transform duration-400 ">
          {category.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition-colors">
            {category.label}
          </h3>
          <p className="text-sm text-muted-foreground">
            {category.count} Event{category.count > 1 && "s"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
