import { cart, removeFromCart, updateDeliveryOption, saveToStorage } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import formatCurrency from '../utils/money.js';
import { deliveryOptions, getDeliveryDate, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export function renderOrderSummary() {
    let cartSummarytHTML = '';
    cart.forEach((cartItem) => {

        const productId = cartItem.productId;
        const quantity = cartItem.quantity;
        const matchingItem = getProduct(productId);
        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);
        const deliveryDate = getDeliveryDate(deliveryOption);
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
            const deliveryDate = getDeliveryDate(deliveryOption);
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

    document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
        link.addEventListener('click', () => {
            const {productId} = link.dataset;
            removeFromCart(productId);
            document.querySelector(`.js-cart-item-container-${productId}`).remove();
            renderOrderSummary();
            renderPaymentSummary();
            renderCheckoutHeader();
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
            renderOrderSummary();
            renderPaymentSummary();
            renderCheckoutHeader();
            saveToStorage();
            
        });
    })


    
    document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
        element.addEventListener('click', () => {
            const { productId, deliveryOptionId } = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });


}