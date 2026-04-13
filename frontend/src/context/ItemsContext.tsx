import React, { createContext } from "react";

export interface Item {
  map(arg0: (obj: { sk: string }) => string): unknown;
  sk: string;
  pk: string; // category
  name: string;
  brand: string;
  imageUrl: string;
  detailUrl: string;
  price: number;
}
[];

interface ItemsContextType {
  itemsArray: Item[];
  setItemsArray: React.Dispatch<React.SetStateAction<Item[]>>;
}

export const ItemsContext = createContext<ItemsContextType | undefined>(
  undefined,
);
