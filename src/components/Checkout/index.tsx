import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootReducer } from "../../store";
import { removeItem, clearCart } from "../../store/reducers/Cart";
import { CheckoutContainer, ItemCard, QuantityInput, CheckoutFooter } from "./styles";

const Checkout: React.FC = () => {
  const { items } = useSelector((state: RootReducer) => state.cart);
  const dispatch = useDispatch();

  const updateQuantity = (id: number, quantity: number) => {
    // implement updateQuantity in Redux if needed
  };

  const removeFromCart = (id: number) => dispatch(removeItem(id));
  const clear = () => dispatch(clearCart());

  const total = items.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  return (
    <CheckoutContainer>
      <h1>Checkout</h1>
      {items.length === 0 ? (
        <p>Seu carrinho está vazio</p>
      ) : (
        <>
          {items.map(item => (
            <ItemCard key={item.id}>
              <span>{item.nome}</span>
              <div>
                <QuantityInput
                  type="number"
                  min={1}
                  value={item.quantidade}
                  onChange={e => updateQuantity(item.id, Number(e.target.value))}
                />
                <span> x R$ {item.preco.toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)}>Remover</button>
              </div>
            </ItemCard>
          ))}
          <CheckoutFooter>
            <h3>Total: R$ {total.toFixed(2)}</h3>
            <button onClick={() => { alert("Pedido realizado!"); clear(); }}>Finalizar Pedido</button>
          </CheckoutFooter>
        </>
      )}
    </CheckoutContainer>
  );
};

export default Checkout;