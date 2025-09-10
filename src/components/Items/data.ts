import { Product } from './types';
import ocaImg from '../../assets/images/oca.jpeg';
import toyImg from '../../assets/images/toy.jpeg';
import bedImg from '../../assets/images/bed.jpeg';

export const products: Product[] = [
  {
    id: 1,
    title: "Oca quentinha",
    description: "Oca bem quentinha para ele dormir",
    image: ocaImg,
    price: "R$ 209,99"
  },
  {
    id: 2,
    title: "Brinquedo bonitinho",
    description: "Para brincar com seu gatinho",
    image: toyImg,
    price: "R$ 89,99"
  },
  {
    id: 3,
    title: "Cama de gato",
    description: "Cama fofinha para seu gato",
    image: bedImg,
    price: "R$ 99,99"
  },
];