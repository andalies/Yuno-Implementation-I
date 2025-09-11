// styles.ts
import styled, { createGlobalStyle } from "styled-components";

export const GlobalOverrides = createGlobalStyle`
  #yuno-container form button[type="submit"] { display: none !important; }
`;

export const CheckoutContainer = styled.div`
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 24px 16px;
  /* leave space so the fixed footer never overlaps content */
  padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
`;

export const ItemCard = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 12px 16px; border-radius: 14px; background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,.06); margin-bottom: 10px;
  span:first-child { font-weight: 600; }
  button { border: 0; background: transparent; color: #f386b3ff; font-weight: 600; cursor: pointer; }
`;

export const QuantityInput = styled.input`
  width: 64px; height: 32px; border-radius: 10px; border: 1px solid #e8e1da;
  padding: 0 8px; text-align: center; font-weight: 600;
`;

/* ✅ Fixed footer always visible, centered, with safe-area padding */
export const CheckoutFooter = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: 980px;
  z-index: 40;

  /* solid background, light shadow, safe-area */
  background: #fff7f0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -6px 18px rgba(0,0,0,.06);

  display: grid;
  row-gap: 12px;

  .total-row {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    font-weight: 700;
  }

  .cta {
    width: 100%;
    border: none;
    border-radius: 999px;
    padding: 14px 20px;
    font-weight: 700;
    color: #fff;
    background: #f386b3ff;
    cursor: pointer;
    transition: transform .02s ease, opacity .15s ease;
  }
  .cta:disabled { opacity: .55; cursor: not-allowed; }
  .cta:active { transform: translateY(1px); }
`;
