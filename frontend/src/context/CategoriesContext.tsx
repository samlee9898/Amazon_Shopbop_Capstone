import { createContext } from "react";

export const CategoriesContext = createContext<{
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
} | null>(null);

export const categories = [];
