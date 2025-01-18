import { getCartQuantity } from "../../data/cart.js";

export function renderCheckoutHeader() {
    const cartQuantity = getCartQuantity();
    document.querySelector('.js-checkout-header-middle-section').innerHTML = `Checkout (<a class="return-to-home-link" href="index.html">${cartQuantity} items</a>)`;
}