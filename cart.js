let cart = JSON.parse(localStorage.getItem('cart')) || [];
const products = [
    {
        id: 1,
        name: "스마트폰",
        price: 1000000,
        image: "../images/phone.jpg"
    },
    // 더 많은 제품 추가
];

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    let total = 0;

    cartItems.innerHTML = '';

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            total += product.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-info">
                    <h3>${product.name}</h3>
                    <p class="cart-item-price">${product.price.toLocaleString()}원</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${item.quantity + 1})">+</button>
                        <button class="btn" onclick="removeFromCart(${product.id})">삭제</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        }
    });

    totalPriceElement.textContent = total.toLocaleString() + '원';
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function checkout() {
    if (cart.length === 0) {
        alert('장바구니가 비어있습니다.');
        return;
    }

    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product.price * item.quantity);
    }, 0);

    const confirmed = confirm(`총 ${total.toLocaleString()}원을 결제하시겠습니까?`);
    
    if (confirmed) {
        
        alert('결제가 완료되었습니다!');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    }
}

document.addEventListener('DOMContentLoaded', displayCart); 