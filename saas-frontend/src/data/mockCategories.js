const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    description: "Gadgets, devices, and all things electronic.",
    parent_category_id: null,
  },
  {
    id: 2,
    name: "Computers",
    description: "Desktops, laptops, and computer components.",
    parent_category_id: 1, // Child of Electronics
  },
  {
    id: 3,
    name: "Mobile Phones",
    description: "Smartphones and related accessories.",
    parent_category_id: 1, // Child of Electronics
  },
  {
    id: 4,
    name: "Books",
    description: "Fiction, non-fiction, educational, and more.",
    parent_category_id: null,
  },
  {
    id: 5,
    name: "Science Fiction",
    description: "Explore futuristic worlds and technologies.",
    parent_category_id: 4, // Child of Books
  },
  {
    id: 6,
    name: "Clothing",
    description: "Apparel for men, women, and children.",
    parent_category_id: null,
  },
  {
    id: 7,
    name: "Men's Wear",
    description: "Clothing and accessories for men.",
    parent_category_id: 6, // Child of Clothing
  },
];

export default mockCategories;
