
const searchInput = document.querySelector('.search-container input');
const searchButton = document.querySelector('.search-btn');
const productGrid = document.querySelector('.product-grid');

const products = [
    {
        id: 1,
        name: '아이폰 14',
        price: 1000000,
        image: 'images/product1.jpg',
        category: '전자기기'
    },
    {
        id: 2,
        name: '맥북 프로',
        price: 2500000,
        image: 'images/product2.jpg',
        category: '전자기기'
    },
    {
        id: 3,
        name: '아디다스 운동화',
        price: 89000,
        image: 'images/product3.jpg',
        category: '의류'
    },
    {
        id: 4,
        name: '나이키 티셔츠',
        price: 55000,
        image: 'images/product4.jpg',
        category: '의류'
    },
    {
        id: 5,
        name: '해리포터 시리즈',
        price: 88000,
        image: 'images/product5.jpg',
        category: '도서'
    }
];

function searchProducts(keyword) {
    const searchTerm = keyword.toLowerCase();
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts);
}

function displayProducts(products) {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productElement = createProductElement(product);
        productGrid.appendChild(productElement);
    });
}

function createProductElement(product) {
    const div = document.createElement('div');
    div.className = 'product-item';
    
    const formattedPrice = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(product.price);
    
    div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${formattedPrice}</p>
        <button class="add-to-cart-btn" data-product-id="${product.id}">
            장바구니 담기
        </button>
    `;
    
    div.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        addToCart(product);
    });
    
    return div;
}

searchButton.addEventListener('click', () => {
    searchProducts(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProducts(searchInput.value);
    }
});

displayProducts(products);

let cartItems = [];
const cartModal = document.getElementById('cartModal');
const cartIcon = document.querySelector('.cart-icon');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.querySelector('.checkout-btn');
const shippingModal = document.getElementById('shippingModal');
const closeShipping = document.querySelector('.close-shipping');
const shippingForm = document.getElementById('shippingForm');

cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
    updateCartDisplay();
});

closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

checkoutBtn.addEventListener('click', () => {
    if (cartItems.length === 0) {
        alert('장바구니가 비어있습니다.');
        return;
    }
    cartModal.style.display = 'none';
    shippingModal.style.display = 'block';
});

closeShipping.addEventListener('click', () => {
    shippingModal.style.display = 'none';
});

shippingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const shippingInfo = {
        receiverName: document.getElementById('receiverName').value,
        receiverPhone: document.getElementById('receiverPhone').value,
        receiverAddress: document.getElementById('receiverAddress').value
    };
    
    processPayment(shippingInfo);
});

function addToCart(product) {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${new Intl.NumberFormat('ko-KR', {
                    style: 'currency',
                    currency: 'KRW'
                }).format(item.price)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    document.getElementById('cartTotal').textContent = 
        new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(total);
}

cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('quantity-btn')) {
        const id = parseInt(e.target.dataset.id);
        const item = cartItems.find(item => item.id === id);
        
        if (e.target.classList.contains('plus')) {
            item.quantity += 1;
        } else if (e.target.classList.contains('minus')) {
            item.quantity = Math.max(0, item.quantity - 1);
            if (item.quantity === 0) {
                cartItems = cartItems.filter(item => item.id !== id);
            }
        }
        
        updateCartCount();
        updateCartDisplay();
    } else if (e.target.classList.contains('remove-item')) {
        const id = parseInt(e.target.dataset.id);
        cartItems = cartItems.filter(item => item.id !== id);
        updateCartCount();
        updateCartDisplay();
    }
});

function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `ORDER${year}${month}${day}-${random}`;
}

function saveOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function processPayment(shippingInfo) {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderData = {
        orderNumber: generateOrderNumber(),
        items: cartItems,
        totalAmount: total,
        orderDate: new Date().toISOString(),
        status: '결제완료',
        shippingInfo: shippingInfo
    };

    saveOrder(orderData);

    alert(`
        주문이 완료되었습니다!
        주문번호: ${orderData.orderNumber}
        받는분: ${shippingInfo.receiverName}
        배송지: ${shippingInfo.receiverAddress}
        결제금액: ${new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(total)}
    `);

    cartItems = [];
    updateCartCount();
    updateCartDisplay();
    cartModal.style.display = 'none';
    shippingModal.style.display = 'none';
}