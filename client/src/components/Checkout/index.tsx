import React, { useCallback, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootReducer } from "../../store";
import { removeItem, clearCart } from "../../store/reducers/Cart";
import {
  CheckoutContainer,
  ItemCard,
  QuantityInput,
  CheckoutFooter,
} from "./styles";

import type { YunoInstance } from "@yuno-payments/sdk-web-types";
import { useYuno } from "../../lib/yuno";
import { createCheckoutSession, createPayment } from "../../lib/api";

const Checkout: React.FC = () => {
  const { items } = useSelector((s: RootReducer) => s.cart);
  const dispatch = useDispatch();
  const { ensureYuno } = useYuno();

  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.preco * item.quantidade, 0),
    [items]
  );

  const updateQuantity = (_id: number, _quantity: number) => {};
  const removeFromCart = (id: number) => dispatch(removeItem(id));
  const clear = () => dispatch(clearCart());

  const handlePay = useCallback(async () => {
    if (!items.length || loading) return;
    setLoading(true);

    try {
      // 1) Create checkout session on backend (amount MUST be decimal, not cents)
      const { checkoutSession, id } = await createCheckoutSession({
        amount: Number(total.toFixed(2)), // decimal
        currency: "BRL",
        country: "BR",
        orderId: `order_${Date.now()}`,
        description: "Cart purchase",
      });

      const session = checkoutSession || id;
      if (!session) throw new Error("Backend did not return checkoutSession.");

      // 2) Load SDK and render embedded
      const yuno: YunoInstance = await ensureYuno();

      await yuno.startCheckout({
        checkoutSession: session,
        elementSelector: "#yuno-container", // embedded target
        countryCode: "BR",
        language: "pt",
        renderMode: { type: "element" },

        async yunoCreatePayment(oneTimeToken: string) {
          // 3) Create payment on your backend using oneTimeToken
          const pr = await createPayment({ oneTimeToken, checkoutSession: session });

          // 4) Required for async flows (PIX, wallets, BNPL)
          await (yuno as any).continuePayment?.({ showPaymentStatus: true });

          // If your flow should only clear on success, check pr.status === "approved" here
          dispatch(clearCart());
          alert("Pagamento criado! Verifique o status na tela.");
        },

        yunoPaymentResult(result: unknown) {
          console.log("Yuno payment result:", result);
          (yuno as any).hideLoader?.();
        },

        yunoError(err: unknown, detail: unknown) {
          console.error("Yuno error:", err, detail);
          (yuno as any).hideLoader?.();
          alert("Ocorreu um erro no pagamento. Tente novamente.");
        },
      });

      // v1.1+: required after startCheckout for element mode
      await (yuno as any).mountCheckout?.();
    } catch (err: any) {
      console.error("handlePay error:", err);
      alert(err?.message ?? "Não foi possível iniciar o checkout.");
    } finally {
      setLoading(false);
    }
  }, [items, loading, total, ensureYuno, dispatch]);

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
                  onChange={(e) => {
                    /* updateQuantity(item.id, Number(e.target.value)) */
                  }}
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

            {/* Embedded checkout renders here */}
            <div id="yuno-container" style={{ minHeight: 640, width: "100%" }} />
          </CheckoutFooter>
        </>
      )}
    </CheckoutContainer>
  );
};

export default Checkout;
