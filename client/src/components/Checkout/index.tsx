import React, { useCallback, useState } from "react";
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

const Checkout: React.FC = () => {
  const { items } = useSelector((s: RootReducer) => s.cart);
  const dispatch = useDispatch();
  const { ensureYuno } = useYuno();

  const [loading, setLoading] = useState(false);

  const updateQuantity = (_id: number, _quantity: number) => {};
  const removeFromCart = (id: number) => dispatch(removeItem(id));
  const clear = () => dispatch(clearCart());
  const total = items.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  const handlePay = useCallback(async () => {
    if (items.length === 0 || loading) return;
    setLoading(true);
    try {
      // 1) Cria a sessão no backend (ele fala com a Yuno usando SECRET)
      const r = await fetch("/checkout/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: "BRL",
          countryCode: "BR",
          orderId: `order_${Date.now()}`,
        }),
      });

      const txt = await r.text(); // tolera HTML de erro
      if (!r.ok) throw new Error(`create session falhou: ${r.status} ${txt}`);

      let data: any;
      try {
        data = JSON.parse(txt || "{}");
      } catch {
        throw new Error(`Resposta inválida do backend: ${txt}`);
      }

      const checkoutSession = data.checkoutSession || data.id;
      if (!checkoutSession) throw new Error("Backend não retornou checkoutSession.");

      // 2) Garante o SDK, inicia e monta o checkout (fluxo v1.1)
      const yuno: YunoInstance = await ensureYuno();

      await yuno.startCheckout({
        checkoutSession,
        elementSelector: "#yuno-container",
        countryCode: "BR",
        language: "pt",
        renderMode: { type: "modal" },

        async yunoCreatePayment(oneTimeToken: string) {
          // 3) Backend cria o pagamento com o oneTimeToken
          const pr = await fetch("/api/create-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oneTimeToken, checkoutSession }),
          });
          const ptxt = await pr.text();
          if (!pr.ok) throw new Error(`create-payment falhou: ${pr.status} ${ptxt}`);

          // 4) Completa fluxos assíncronos (Pix, wallets, BNPL…)
          await (yuno as any).continuePayment?.({ showPaymentStatus: true });

          dispatch(clearCart());
          alert("Pagamento realizado com sucesso!");
        },

        yunoPaymentResult(result: unknown) {
          console.log("Yuno payment result:", result);
          (yuno as any).hideLoader?.();
        },

        yunoError(error: unknown, detail: unknown) {
          console.error("Yuno error:", error, detail);
          (yuno as any).hideLoader?.();
          alert("Ocorreu um erro no pagamento. Tente novamente.");
        },
      });

      await yuno.mountCheckout(); // obrigatório após startCheckout
      // opcional: disparar fluxo manual
      // await yuno.startPayment();
    } catch (e: any) {
      console.error("handlePay error:", e);
      alert(e?.message ?? "Não foi possível iniciar o checkout.");
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
            {/* usado se renderMode: "element" */}
            <div id="yuno-container" />
          </CheckoutFooter>
        </>
      )}
    </CheckoutContainer>
  );
};

export default Checkout;
