import styled from "styled-components";

export const CheckoutContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

export const ItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 1rem;
`;

export const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  margin: 0 0.5rem;
`;

export const CheckoutFooter = styled.div`
  margin-top: 2rem;
  text-align: right;
  button {
    background-color: #ff6f61;
    color: white;
    border: none;
    padding: 0.7rem 1.2rem;
    border-radius: 2rem;
    cursor: pointer;
    font-weight: bold;
  }
`;