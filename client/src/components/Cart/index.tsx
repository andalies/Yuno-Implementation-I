import { useDispatch, useSelector } from "react-redux";
import {
  Overlay, BotaoCart, CartContainer, Quantity,
  SideBar, Prices, Title, CartItem
} from "./styles";
import Checkout from "../Checkout";
import { RootReducer } from "../../store";
import { close, openOrder, removeItem, clearCart } from "../../store/reducers/Cart";

const Cart = () => {
  const { isOpen, items, isOrder } = useSelector((state: RootReducer) => state.cart);
  const dispatch = useDispatch();

  const closeCart = () => dispatch(close());
  const abrirPedido = () => dispatch(openOrder());
  const removerItem = (id: number) => dispatch(removeItem(id));
  const total = items.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  if (!isOpen) return null;

  return (
    <CartContainer className={isOpen ? "is-open" : ""}>
      <Overlay onClick={closeCart} />
      <SideBar>
        {isOrder ? (
          <Checkout /> // reads items from Redux via useSelector
        ) : (
          <>
            <ul>
              {items.length === 0 ? <p>Carrinho vazio</p> : items.map(item => (
                <CartItem key={item.id}>
                  <img src={item.foto} alt={item.nome} />
                  <div>
                    <Title>{item.nome}</Title>
                    <span>R$ {item.preco.toFixed(2)}</span>
                  </div>
                  {item.quantidade > 1 && <Quantity>{item.quantidade}x</Quantity>}
                  <button onClick={() => removerItem(item.id)}>Remover</button>
                </CartItem>
              ))}
            </ul>
            <Prices>
              <p>Valor total:</p>
              <p>R$ {total.toFixed(2)}</p>
            </Prices>
            <BotaoCart onClick={abrirPedido}>Continuar com a entrega</BotaoCart>
          </>
        )}
      </SideBar>
    </CartContainer>
  );
};

export default Cart;