import { Product } from './types';
import vestido1Img from '../../assets/images/dress1.jpg';
import vestido2Img from '../../assets/images/dress2.jpg';
import vestido3Img from '../../assets/images/dress3.jpg';

export const products: Product[] = [
  {
    id: 1,
    title: "Vestido I",
    description: "Lindo vestido",
    image: vestido1Img,
    price: "R$ 209,99"
  },
  {
    id: 2,
    title: "Vestido II",
    description: "Vestido branco",
    image: vestido2Img,
    price: "R$ 89,99"
  },
  {
    id: 3,
    title: "Vestido III",
    description: "Vestido preto e branco",
    image: vestido3Img,
    price: "R$ 99,99"
  },
];