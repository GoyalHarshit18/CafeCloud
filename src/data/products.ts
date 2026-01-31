import { Product } from '@/types/pos';

// Images can be replaced with real assets or kept as placeholders
import pizzaImg from '@/assets/food/pizza.jpg';
import burgerImg from '@/assets/food/burger.jpg';
import coffeeImg from '@/assets/food/coffee.jpg';
import dessertImg from '@/assets/food/dessert.jpg';

export const products: Product[] = [
  // Food
  {
    id: 'food-1',
    name: 'Margherita Pizza',
    price: 299,
    category: 'Food',
    image: pizzaImg,
    description: 'Classic tomato, mozzarella & fresh basil'
  },
  {
    id: 'food-2',
    name: 'Classic Cheeseburger',
    price: 249,
    category: 'Food',
    image: burgerImg,
    description: 'Beef patty with cheddar & pickles'
  },
  // Beverages
  {
    id: 'bev-1',
    name: 'Cappuccino',
    price: 149,
    category: 'Beverages',
    image: coffeeImg,
    description: 'Espresso with steamed milk foam'
  },
  // Desserts
  {
    id: 'dessert-1',
    name: 'Chocolate Lava Cake',
    price: 199,
    category: 'Desserts',
    image: dessertImg,
    description: 'Warm cake with molten center'
  },
];

import allCatImg from '@/assets/categories/all.png';
import foodCatImg from '@/assets/categories/food.png';
import bevCatImg from '@/assets/categories/beverages.png';
import dessertCatImg from '@/assets/categories/desserts.png';

export const categories = [
  { id: 'all', name: 'All Items', icon: '🍽️', image: allCatImg },
  { id: 'Food', name: 'Food', icon: '🍔', image: foodCatImg },
  { id: 'Beverages', name: 'Beverages', icon: '☕', image: bevCatImg },
  { id: 'Desserts', name: 'Desserts', icon: '🍰', image: dessertCatImg },
];
