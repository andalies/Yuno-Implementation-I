import React from "react";
import { products } from "./data";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../store/reducers/Cart";
import type { RootReducer } from "../../store";
import {
  Container, Title, CardGrid, Card, CardImage,
  CardBody, CardTitle, CardText, Button, Price
} from "./styles";

const Products: React.FC = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootReducer) => state.cart.items);

  const handleAddToCart = (product: typeof products[0]) => {
    dispatch(addItem({
      id: product.id,
      nome: product.title,
      preco: parseFloat(product.price.replace("R$ ", "").replace(",", ".")),
      foto: product.image,
      quantidade: 1,
    }));
  };

  return (
    <Container>
      <Title>Produtos</Title>
      <CardGrid>
        {products.map(product => (
          <Card key={product.id}>
            <CardImage src={product.image} alt={product.title} />
            <CardBody>
              <CardTitle>{product.title}</CardTitle>
              <CardText>{product.description}</CardText>
              <Button onClick={() => handleAddToCart(product)}>
                Adicionar ao Carrinho
              </Button>
              <Price>{product.price}</Price>
            </CardBody>
          </Card>
        ))}
      </CardGrid>
    </Container>
  );
};

export default Products;