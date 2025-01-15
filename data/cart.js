export let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];


function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
    let matchingItem;
    const quantitySelector = document.querySelector(`.js-quantity-slector-product-${productId}`);
    const quantity = Number(quantitySelector.value);
    cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
  
    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      cart.push({
          productId,
          quantity,
          deliveryOptionId: '1'
      });
    }
    saveToStorage();
}

export function removeFromCart(productId) {

  const newCart = [];

  cart.forEach((cartItem, index) => {
    if (productId !== cartItem.productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;
  saveToStorage();
}