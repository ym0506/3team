// 상품 데이터
const products = [
    {
        id: 1,
        name: "아이폰 15 Pro",
        price: 1500000,
        image: "images/iphone15.jpg",
        category: "electronics",
        description: "최신 아이폰 15 Pro 256GB",
        stock: 10
    },
    {
        id: 2,
        name: "맥북 프로 16인치",
        price: 3500000,
        image: "images/macbook.jpg",
        category: "electronics",
        description: "M3 Max 칩셋 탑재 맥북 프로",
        stock: 5
    },
    // 더 많은 제품 추가
];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    initializeEventListeners();
    updateCartCount();
});

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 검색 기능
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');

    searchInput?.addEventListener('input', debounce(() => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    }, 300));

    // 카테고리 필터
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            const filteredProducts = category === 'all' 
                ? products 
                : products.filter(product => product.category === category);
            
            displayProducts(filteredProducts);
        });
    });
}

// 디바운스 
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 제품 표시 
function displayProducts(products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <p class="price">${formatPrice(product.price)}</p>
            <p class="stock">${product.stock > 0 ? `재고: ${product.stock}개` : '품절'}</p>
            <button class="btn" 
                    onclick="addToCart(${product.id})"
                    ${product.stock === 0 ? 'disabled' : ''}>
                ${product.stock > 0 ? '장바구니에 담기' : '품절'}
            </button>
        `;
        
        productGrid.appendChild(productCard);
    });
}

// 가격 포맷 
function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(price);
}

// 장바구니 관련 
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            alert('재고가 부족합니다.');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name}이(가) 장바구니에 추가되었습니다.`);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }, 100);
} 