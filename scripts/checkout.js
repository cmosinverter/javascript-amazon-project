import { cart, removeFromCart, updateDeliveryOption } from '../data/cart.js';
import { products } from '../data/products.js';
import formatCurrency from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';


const today = dayjs();

updateQuantity();
let cartSummarytHTML = '';
cart.forEach((cartItem) => {

    const productId = cartItem.productId;
    const quantity = cartItem.quantity;

    let matchingItem;
    products.forEach((product) => {
        if (productId === product.id) {
            matchingItem = product;
        }
    });

    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption;
    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
            deliveryOption = option;
        }
    });
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const deliveryDateFormatted = deliveryDate.format('dddd, MMMM D');

    cartSummarytHTML += 
        `<div class="cart-item-container js-cart-item-container-${productId}">
            <div class="delivery-date">
                Delivery date: ${deliveryDateFormatted}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src=${matchingItem.image}>

                <div class="cart-item-details">
                <div class="product-name">
                    ${matchingItem.name}
                </div>
                <div class="product-price">
                    $${(formatCurrency(matchingItem.priceCents))}
                </div>
                <div class="product-quantity">
                    <span>
                    Quantity: <span class="quantity-label">${quantity}</span>
                    </span>
                    
                    <span class="update-quantity-link link-primary js-update-link" data-product-id="${productId}">
                    Update
                    </span>
                    <input class="quantity-input">
                    <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${productId}">Save</span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${productId}">
                    Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(productId, cartItem)}
                </div>
            </div>
            </div>`;
});

function deliveryOptionsHTML(productId, cartItem) {
    
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const deliveryDateFormatted = deliveryDate.format('dddd, MMMM D');
        const priceCents = deliveryOption.priceCents;
        const priceString = priceCents === 0 ? 'FREE Shipping' : `$${formatCurrency(priceCents)} - Shipping`;
        const isChecked = cartItem.deliveryOptionId === deliveryOption.id;
        html += `
            <div class="delivery-option js-delivery-option" 
                data-product-id="${productId}"
                data-delivery-option-id="${deliveryOption.id}">
                <input type="radio" ${isChecked ? 'checked' : ''}
                class="delivery-option-input"
                name="delivery-option-${productId}">
                <div>
                <div class="delivery-option-date">
                    ${deliveryDateFormatted}
                </div>
                <div class="delivery-option-price">
                    ${priceString}
                </div>
                </div>
            </div>
        `;
        
    });
    return html;
}

document.querySelector('.js-order-summary').innerHTML = cartSummarytHTML;


function updateQuantity() {

    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });
    document.querySelector('.js-checkout-header-middle-section').innerHTML = `Checkout (<a class="return-to-home-link" href="index.html">${cartQuantity} items</a>)`;
}

document.querySelectorAll('.js-delete-link')
.forEach((link) => {
    link.addEventListener('click', () => {
        const productId  = link.dataset.productId;
        removeFromCart(productId);
        document.querySelector(`.js-cart-item-container-${productId}`).remove();
        updateQuantity();
    });
})

document.querySelectorAll('.js-update-link')
.forEach((link) => {
    link.addEventListener('click', () => {
        
        const productId = link.dataset.productId;
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add('is-editing-quantity');
        
    });
    link.addEventListener('onkeydown', (event) => {
        console.log(event.key);
        if (event.key === 'Enter') {
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add('is-editing-quantity');
        }
    });
})

document.querySelectorAll('.js-save-quantity-link')
.forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        const quantityLabel = container.querySelector('.quantity-label');
        const OldQuantity = Number(quantityLabel.textContent);
        const quantityInput = container.querySelector('.quantity-input');
        let newQuantity = Number(quantityInput.value);
        if (newQuantity < 0 || newQuantity >= 1000) {
            alert('Quantity must be at least 0 and less than 1000');
            return;
        }

        if (!quantityInput.value) {
            newQuantity = OldQuantity;
        } else if (newQuantity === 0) {
            removeFromCart(productId);
            document.querySelector(`.js-cart-item-container-${productId}`).remove();
        } else {
            quantityLabel.textContent = newQuantity;
            cart.forEach((cartItem) => {
                if (cartItem.productId === productId) {
                    cartItem.quantity = newQuantity;
                }
            });
        }
        container.classList.remove('is-editing-quantity');
        updateQuantity();
        
    });
})

let itemsTotal = 0;

cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const quantity = cartItem.quantity;

    let matchingItem;
    products.forEach((product) => {
        if (productId === product.id) {
            matchingItem = product;
        }
    });

    itemsTotal += matchingItem.priceCents * quantity;
});
itemsTotal = formatCurrency(itemsTotal);

let paymentSummaryHTML = `

<div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${itemsTotal}</div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$4.99</div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$47.74</div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$4.77</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$52.51</div>
        </div>

        <button class="place-order-button button-primary">
            Place your order
        </button>
`;

document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
document.querySelectorAll('.js-delivery-option')
.forEach((element) => {
    element.addEventListener('click', () => {
        const { productId, deliveryOptionId } = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
    });
});
