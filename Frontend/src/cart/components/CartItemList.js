import React from "react";
import CartItem from "./CartItem";

export default function CartItemList(props) {
  return (
    <div>
      {props.cart.cartItems.map((cartItem, index) => (
        <CartItem
          key={index}
          product={cartItem.product}
          size={cartItem.size}
          amount={cartItem.amount}
          price={cartItem.product.price}
          cartItemId={cartItem._id}
          onRemove={props.onRemove}
        />
      ))}
    </div>
  );
}
