
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootReducer } from "../../store";
import { removeItem, clearCart } from "../../store/reducers/Cart";
import {
  CheckoutContainer,
  ItemCard,
  QuantityInput,
  CheckoutFooter,
} from "./styles";
import { loadScript } from "@yuno-payments/sdk-web";
// Tipos opcionais (melhora autocomplete):
import type { YunoInstance } from "@yuno-payments/sdk-web-types";


const Checkout: React.FC = () => {
  const { items } = useSelector((state: RootReducer) => state.cart);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const yunoRef = useRef<YunoInstance | null>(null);

  const updateQuantity = (id: number, quantity: number) => {
    // TODO: implementar update no Redux se quiser alterar qtd
  };

  const removeFromCart = (id: number) => dispatch(removeItem(id));
  const clear = () => dispatch(clearCart());

  const total = items.reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  );

  const handlePay = useCallback(async () => {
    if (items.length === 0 || loading) return;

    setLoading(true);
    try {
      
      // Vite: variáveis precisam começar com VITE_
      const publicKey = import.meta.env.VITE_YUNO_PUBLIC_KEY as string | undefined;
      if (!publicKey) {
        alert("Chave pública da Yuno ausente (VITE_YUNO_PUBLIC_KEY).");
        setLoading(false);
        return;
      }

      // 1) Obter checkoutSession do seu backend
      const sessionRes = await fetch("/api/create-checkout-session", { method: "POST" });
      if (!sessionRes.ok) throw new Error("Falha ao criar checkoutSession no backend");
      const { checkoutSession } = await sessionRes.json();

      // 2) Carregar o SDK (apenas uma vez)
      if (!yunoRef.current) {
        const yuno = await loadScript();     // carrega e injeta a lib
        yuno.initialize(publicKey);          // inicializa com sua public key
        yunoRef.current = yuno;              // guarda a instância tipada
      }

      // 3) Iniciar o checkout
      await yunoRef.current.startCheckout({
        checkoutSession,
        elementSelector: "#yuno-container",
        countryCode: "BR",
        language: "pt",
        renderMode: { type: "modal" }, // troque para { type: "element" } se quiser embutido
        async yunoCreatePayment(oneTimeToken) {
          const r = await fetch("/api/create-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oneTimeToken, checkoutSession }),
          });
          if (!r.ok) throw new Error("Falha ao criar pagamento no backend");
          dispatch(clearCart());
          alert("Pagamento realizado com sucesso!");
        },
        yunoPaymentResult(data) {
          console.log("Yuno payment result:", data);
          yunoRef.current?.hideLoader();
        },
        yunoError(error, data) {
          console.error("Yuno error:", error, data);
          yunoRef.current?.hideLoader();
          alert("Ocorreu um erro no pagamento. Tente novamente.");
        },
      });
    } catch (err) {
      console.error(err);
      alert("Não foi possível iniciar o checkout.");
    } finally {
      setLoading(false);
    }
  }, [items, loading, dispatch]);

  return (
    <CheckoutContainer>
      <h1>Checkout</h1>
      {items.length === 0 ? (
        <p>Seu carrinho está vazio</p>
      ) : (
        <>
          {items.map((item) => (
            <ItemCard key={item.id}>
              <span>{item.nome}</span>
              <div>
                <QuantityInput
                  type="number"
                  min={1}
                  value={item.quantidade}
                  onChange={(e) =>
                    updateQuantity(item.id, Number(e.target.value))
                  }
                />
                <span> x R$ {item.preco.toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)}>Remover</button>
              </div>
            </ItemCard>
          ))}
          <CheckoutFooter>
            <h3>Total: R$ {total.toFixed(2)}</h3>

            <button onClick={handlePay} disabled={loading}>
              {loading ? "Abrindo checkout..." : "Pagar com Yuno"}
            </button>

            {/* Para modo "element", o SDK usa esse container */}
            <div id="yuno-container" />
          </CheckoutFooter>
        </>
      )}
    </CheckoutContainer>
  );
};

export default Checkout;