export const CATEGORIES = [
  {
    id: "tech",
    label: "Technology",
    icon: "💻",
    description: "Tech news and updates and announcements",
  },
  {
    id: "business",
    label: "Business",
    icon: "📈",
    description: "Business trends, market insights, and corporate updates",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: "🎬",
    description: "Movies, shows, celebrity news, and entertainment buzz",
  },
  {
    id: "sports",
    label: "Sports",
    icon: "⚽",
    description: "Scores, highlights, and sports event updates",
  },
  {
    id: "health",
    label: "Health",
    icon: "🩺",
    description: "Wellness tips, medical news, and health insights",
  },
  {
    id: "science",
    label: "Science",
    icon: "🔬",
    description: "Scientific discoveries, research, and innovation",
  },
  {
    id: "travel",
    label: "Travel",
    icon: "✈️",
    description: "Travel guides, tips, and destination highlights",
  },
  {
    id: "food",
    label: "Food",
    icon: "🍽️",
    description: "Recipes, food culture, and culinary trends",
  },
  {
    id: "finance",
    label: "Finance",
    icon: "💰",
    description: "Personal finance, investing, and economic updates",
  },
  {
    id: "gaming",
    label: "Gaming",
    icon: "🎮",
    description: "Game releases, updates, and esports news",
  },
  {
    id: "music",
    label: "Music",
    icon: "🎵",
    description: "New releases, artist updates, and music trends",
  },
];

// Get category by id
export const getCategoryById = (id) => {
  return CATEGORIES.find((category) => category.id === id);
};

// get category label by id
export const getCategoryLabelById = (id) => {
  const category = getCategoryById(id);
  return category ? category.label : id;
};

//get category icon by id
export const getCategoryIconById = (id) => {
  const category = getCategoryById(id);
  return category ? category.icon : "🔍";
};

//get category description by id
export const getCategoryDescriptionById = (id) => {
  const category = getCategoryById(id);
  return category ? category.description : "";
};