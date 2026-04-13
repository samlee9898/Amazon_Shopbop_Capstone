import type { Item } from "../context/ItemsContext"

type session = {
    //sessionId: string, // auto increment in database? more like primary key. In the future, if we need to grab specific session, then must needed. (generally good to keep it)
    username: string, // important
    category: string, 
    createdAt: string, // can be helpful in sorting     // Date.now()
    selectedItems: Item[] // dynamoDB can store arrays
}

// this connects to userId
// user stores sessions in array in database
// guest stores sessions in array in sessionStorage

// flow (user)
// 1. POST request to database with session based on "username" (end of pair session)
// 2. store it in database
// 3. when user enters past rankings pages
// 4. get request of all those saved sessions based on "username" (response will be array of sessions)

// flow (guest)
// 1. save session in sessionStorage (maintain array of sessions)
// 2. if user logins, "if sessionStorage is not empty" then flush those session to POST request to database based on "username"
// 3. ... same workflow as user ...

// Auth
// isLoggedIn, username
// logout...?

type rankedItem = {
  imageUrl: string;
  name: string;
  brand: string;
  price: string,
  detailUrl: string
  elo: number
  productId: string
};

export const recommendedItems: rankedItem[] = [
  {
    name: "Soft Silk Dress",
    brand: "STAUD",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: "620.00",
    elo: 1000,
    productId: "1597393460"
  },
  {
    name: "Evening Gown",
    brand: "Vanessa Beard",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: "580.00",
    elo: 1000,
    productId: "1597393460"
  },
  {
    name: "Daisy Dress",
    brand: "Figue",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: "698.00",
    elo: 1000,
    productId: "1597393460"
  }
]

export const dummyItems = [
  {
    sk: "1",
    pk: "dress",
    name: "Soft Silk Dress",
    brand: "STAUD",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 620,
  },
  {
    sk: "2",
    pk: "dress",
    name: "Evening Gown",
    brand: "Vanessa Beard",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 580,
  },
  {
    sk: "3",
    pk: "dress",
    name: "Daisy Dress",
    brand: "Figue",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 698,
  },
  {
    sk: "4",
    pk: "dress",
    name: "Street Minimal Dress",
    brand: "Les Genes",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 410,
  },
  {
    sk: "5",
    pk: "dress",
    name: "Bold Maxi Dress",
    brand: "Natalie Martin",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 390,
  },
  {
    sk: "6",
    pk: "dress",
    name: "Thea Dress",
    brand: "Tanya Taylor",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 545,
  },
  {
    sk: "7",
    pk: "dress",
    name: "Manuela Dress",
    brand: "LoveShackFancy",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 445,
  },
  {
    sk: "8",
    pk: "dress",
    name: "Piper Dress",
    brand: "Cara Cara",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 525,
  },
  {
    sk: "9",
    pk: "dress",
    name: "The Soglio Dress",
    brand: "Solid & Striped",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 448,
  },
  {
    sk: "10",
    pk: "dress",
    name: "Daily Midi Dress",
    brand: "Hunter Bell",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 465,
  },
  {
    sk: "11",
    pk: "dress",
    name: "Classic Midi",
    brand: "Lioness",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 280,
  },
  {
    sk: "12",
    pk: "dress",
    name: "Luxury Aesthetic Dress",
    brand: "Lioness",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 295,
  },
  {
    sk: "13",
    pk: "dress",
    name: "Pastel Midi",
    brand: "Alice + Olivia",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 385,
  },
  {
    sk: "14",
    pk: "dress",
    name: "Formal Maxi Dress",
    brand: "Reformation",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 428,
  },
  {
    sk: "15",
    pk: "dress",
    name: "White Aura Dress",
    brand: "Aje",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 490,
  },
  {
    sk: "16",
    pk: "dress",
    name: "Relaxed Light Dress",
    brand: "Réfête",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 470,
  },
  {
    sk: "1",
    pk: "dress",
    name: "Soft Silk Dress",
    brand: "STAUD",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 620,
  },
  {
    sk: "2",
    pk: "dress",
    name: "Evening Gown",
    brand: "Vanessa Beard",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 580,
  },
  {
    sk: "3",
    pk: "dress",
    name: "Daisy Dress",
    brand: "Figue",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 698,
  },
  {
    sk: "4",
    pk: "dress",
    name: "Street Minimal Dress",
    brand: "Les Genes",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 410,
  },
  {
    sk: "5",
    pk: "dress",
    name: "Bold Maxi Dress",
    brand: "Natalie Martin",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 390,
  },
  {
    sk: "6",
    pk: "dress",
    name: "Thea Dress",
    brand: "Tanya Taylor",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 545,
  },
  {
    sk: "7",
    pk: "dress",
    name: "Manuela Dress",
    brand: "LoveShackFancy",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 445,
  },
  {
    sk: "8",
    pk: "dress",
    name: "Piper Dress",
    brand: "Cara Cara",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 525,
  },
  {
    sk: "9",
    pk: "dress",
    name: "The Soglio Dress",
    brand: "Solid & Striped",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 448,
  },
  {
    sk: "10",
    pk: "dress",
    name: "Daily Midi Dress",
    brand: "Hunter Bell",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 465,
  },
  {
    sk: "11",
    pk: "dress",
    name: "Classic Midi",
    brand: "Lioness",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 280,
  },
  {
    sk: "12",
    pk: "dress",
    name: "Luxury Aesthetic Dress",
    brand: "Lioness",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 295,
  },
  {
    sk: "13",
    pk: "dress",
    name: "Pastel Midi",
    brand: "Alice + Olivia",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 385,
  },
  {
    sk: "14",
    pk: "dress",
    name: "Formal Maxi Dress",
    brand: "Reformation",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 428,
  },
  {
    sk: "15",
    pk: "dress",
    name: "White Aura Dress",
    brand: "Aje",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 490,
  },
  {
    sk: "16",
    pk: "dress",
    name: "Relaxed Light Dress",
    brand: "Réfête",
    imageUrl:
      "",
    detailUrl: "https://www.shopbop.com/",
    price: 470,
  },
];