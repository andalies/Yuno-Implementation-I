import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootReducer } from "../../store";
import { removeItem, clearCart } from "../../store/reducers/Cart";
import {
  CheckoutContainer,
  ItemCard,
  QuantityInput,
  CheckoutFooter,
  GlobalOverrides,
} from "./styles";
import type { YunoInstance } from "@yuno-payments/sdk-web-types";
import { useYuno } from "../../lib/yuno";
import { createCheckoutSession, createPayment } from "../../lib/api";

const UI_LANG = "pt" as const;
const UI_COUNTRY = "BR" as const;

const Checkout: React.FC = () => {
  const { items } = useSelector((s: RootReducer) => s.cart);
  const dispatch = useDispatch();
  const { ensureYuno } = useYuno();

  const yunoRef = useRef<YunoInstance | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null); // scroll target

  // UI state
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);       // SDK mounted & showing methods
  const [methodChosen, setMethodChosen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.preco * item.quantidade, 0),
    [items]
  );

  const removeFromCart = (id: number) => dispatch(removeItem(id));

  // Detect method selection (nice-to-have; button still works without it)
  useEffect(() => {
    if (!mounted) return;
    const el = document.getElementById("yuno-container");
    if (!el) return;

    const mark = () => setMethodChosen(true);
    const onClick = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("[data-yuno-payment-method]")) mark();
    };
    const onChange = (e: Event) => {
      const i = e.target as HTMLInputElement | null;
      if (i && i.type === "radio") mark();
    };

    el.addEventListener("click", onClick);
    el.addEventListener("change", onChange);
    return () => {
      el.removeEventListener("click", onClick);
      el.removeEventListener("change", onChange);
    };
  }, [mounted]);

  // Step 1: create session and mount SDK
  const handlePay = useCallback(async () => {
    if (mounted || !items.length || loading) return;
    setLoading(true);

    try {
      // prepare order/session data
      const amountInCents = Math.round(total * 100);
      const description = items.length
        ? `Pedido: ${items.map((i) => i.nome).join(", ")}`
        : `Pedido ${Date.now()}`;
      const orderId = `order_${Date.now()}`;

      // 1) Create checkout session on backend
      const { checkoutSession, id } = await createCheckoutSession({
        amount: amountInCents,
        currency: "BRL",
        countryCode: UI_COUNTRY,
        orderId,
        description,
      });
      const session = checkoutSession || id;
      if (!session) throw new Error("Backend did not return checkoutSession.");

      // 2) Mount Yuno SDK (element mode)
      const yuno = await ensureYuno();
      yunoRef.current = yuno;

      await yuno.startCheckout({
        checkoutSession: session,
        elementSelector: "#yuno-container",
        countryCode: UI_COUNTRY,
        language: UI_LANG,
        renderMode: { type: "element" },

        // the SDK calls this with a one-time token
        async yunoCreatePayment(oneTimeToken: string) {
          const paymentResp = await createPayment({
            oneTimeToken,
            checkoutSession: session,
            merchantOrderId: orderId,
            description,
            country: UI_COUNTRY,
            amount: amountInCents,   // cents
            currency: "BRL",
            returnUrl: `${window.location.origin}/yuno/return`,
          });

          const payment = (paymentResp as any)?.payment ?? paymentResp;
          const sdkRequired =
            payment?.checkout?.sdk_action_required === true ||
            payment?.sdk_action_required === true;

          if (sdkRequired) {
            // handle 3DS/redirect; show status after challenge
            await (yuno as any).continuePayment?.({ showPaymentStatus: true });
          } else {
            // ✅ show inline status UI (language is required)
            await (yuno as any).mountStatusPayment?.({
              checkoutSession: session,
              countryCode: UI_COUNTRY,
              language: UI_LANG,
            });
          }

          // optional: your own success feedback
          try {
            const approved =
              payment?.status === "SUCCEEDED" ||
              payment?.sub_status === "APPROVED";
            if (approved) {
              console.log("✅ Payment approved:", payment?.id);
            }
          } catch {}

          dispatch(clearCart());
        },

        yunoPaymentResult(result: unknown) {
          console.log("Yuno payment result:", result);
          (yuno as any).hideLoader?.();
          setModalOpen(false);
        },

        yunoError(err: unknown, detail: unknown) {
          console.error("Yuno error:", err, detail);
          (yuno as any).hideLoader?.();
          setModalOpen(false);
          alert("Ocorreu um erro no pagamento. Tente novamente.");
        },
      });

      await (yuno as any).mountCheckout?.(); // render methods
      setMounted(true);
      setMethodChosen(false);

      // bring methods + fixed footer into view
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err: any) {
      console.error("handlePay error:", err);
      alert(err?.message ?? "Não foi possível iniciar o checkout.");
    } finally {
      setLoading(false);
    }
  }, [items, loading, total, ensureYuno, dispatch, mounted]);

  // Step 2: continue with selected method
  const handleContinue = useCallback(async () => {
    try {
      setModalOpen(true); // hide footer CTA while modal/flow is open
      await yunoRef.current?.startPayment?.();
    } catch (e) {
      console.error("startPayment failed:", e);
      setModalOpen(false);
      alert("Erro ao continuar pagamento.");
    }
  }, []);

  return (
    <CheckoutContainer>
      {/* Hide Yuno internal submit so only your CTA shows */}
      <GlobalOverrides />

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
                  onChange={() => {}}
                />
                <span> x R$ {item.preco.toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)}>Remover</button>
              </div>
            </ItemCard>
          ))}

          {/* wrapper so we can scroll to the methods */}
          <div ref={containerRef}>
            <div id="yuno-container" style={{ minHeight: 640, width: "100%" }} />
          </div>

          {/* fixed footer with total + CTAs */}
          <CheckoutFooter>
            <div className="total-row">
              <span>Total: R$ {total.toFixed(2)}</span>
            </div>

            {!mounted && (
              <button className="cta" onClick={handlePay} disabled={loading}>
                {loading ? "Abrindo checkout..." : "Pagar com Yuno"}
              </button>
            )}

            {mounted && !modalOpen && (
              <button
                className="cta"
                onClick={handleContinue}
                disabled={loading}
              >
                {methodChosen ? "Continuar pagamento" : "Selecionar e continuar"}
              </button>
            )}
          </CheckoutFooter>
        </>
      )}
    </CheckoutContainer>
  );
};

export default Checkout;
