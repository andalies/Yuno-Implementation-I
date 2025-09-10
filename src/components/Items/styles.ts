import styled from "styled-components";

export const Container = styled.section`
  padding: 2rem;
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

export const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Card = styled.div`
  width: 18rem;
  margin: 1rem;
  border-radius: 2rem;
  text-align: center;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  border: 0;
`;

export const CardImage = styled.img`
  width: 100%;
  display: block;
`;

export const CardBody = styled.div`
  padding: 1rem;
`;

export const CardTitle = styled.h5`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const CardText = styled.p`
  margin-bottom: 1rem;
`;

export const Button = styled.a`
  display: inline-block;
  background-color: #fcbcd7ff;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  text-decoration: none;
  margin-bottom: 1rem;
  &:hover {
    background-color: #e2e2e2;
  }
`;

export const Price = styled.p`
  margin-top: 1rem;
  font-weight: bold;
`;

export const CartButton = styled.button`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  background-color: #f8f9fa;
  padding: 0.7rem 1rem;
  border-radius: 2rem;
  border: none;
  cursor: pointer;
  z-index: 1001;
`;

export const CartOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  z-index: 1000;
`;

export const CartModal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100%;
  background: #fff;
  box-shadow: -3px 0 10px rgba(0,0,0,0.2);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  z-index: 1001;
`;

export const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

export const CartList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  button {
    margin-left: 0.5rem;
    padding: 0.3rem 0.5rem;
  }
`;

export const CartFooter = styled.div`
  padding-top: 1rem;
  border-top: 1px solid #ddd;
`;
