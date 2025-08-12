// Global variables
let currentSlide = 0;
let products = [];
let cart = [];
let currentUser = null;
let isLoggedIn = false;
let isSortedAZ = true;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    loadProducts();
    setupEventListeners();
    startSlider();
    checkLoginStatus();
    loadCartFromStorage();
    updateCartDisplay();
}

// Product data
const productData = [
    { id: 1, name: "Shampoo Kérastase Nutritive", price: 125.90, category: "cabelo", image: "img/shampo-kerastase-semfundo3.png", description: "Shampoo nutritivo para cabelos secos e danificados" },
    { id: 2, name: "Condicionador L'Oréal Professionnel", price: 89.50, category: "cabelo", image: "img/shampo-kerastase2-semfundo.png", description: "Condicionador reparador para cabelos tratados quimicamente" },
    { id: 3, name: "Máscara Facial La Roche-Posay", price: 156.90, category: "facial", image: "img/mascarascapilar-sem-fundo.png", description: "Máscara hidratante com ácido hialurônico" },
    { id: 4, name: "Sérum Vichy Vitamin C", price: 189.90, category: "facial", image: "img/cremesver-sem-fundo.png", description: "Sérum antioxidante com vitamina C pura" },
    { id: 5, name: "Shampoo Kérastase Nutritive", price: 125.90, category: "cabelo", image: "img/shapoo-sem-fundo.png", description: "Shampoo nutritivo para cabelos secos e danificados" },
    { id: 2, name: "Condicionador L'Oréal Professionnel", price: 89.50, category: "cabelo", image: "img/shapoo-sem-fundo.png", description: "Condicionador reparador para cabelos tratados quimicamente" },
    { id: 3, name: "Máscara Facial La Roche-Posay", price: 156.90, category: "facial", image: "img/mascarascapilar-sem-fundo.png", description: "Máscara hidratante com ácido hialurônico" },
    { id: 4, name: "Sérum Vichy Vitamin C", price: 189.90, category: "facial", image: "img/loreal-serum-sem-fundo.png", description: "Sérum antioxidante com vitamina C pura" },
    { id: 9, name: "Shampoo Kérastase Nutritive", price: 125.90, category: "cabelo", image: "img/shampo-kerastase2-semfundo.png", description: "Shampoo nutritivo para cabelos secos e danificados" },
    { id: 2, name: "Condicionador L'Oréal Professionnel", price: 89.50, category: "cabelo", image: "img/shapoo-sem-fundo.png", description: "Condicionador reparador para cabelos tratados quimicamente" },
    { id: 3, name: "Máscara Facial La Roche-Posay", price: 156.90, category: "facial", image: "img/mascarascapilar-sem-fundo.png", description: "Máscara hidratante com ácido hialurônico" },
    { id: 4, name: "Sérum Vichy Vitamin C", price: 189.90, category: "facial", image: "img/loreal-serum-sem-fundo.png", description: "Sérum antioxidante com vitamina C pura" },
    { id: 13, name: "Shampoo Kérastase Nutritive", price: 125.90, category: "cabelo", image: "img/shapoo-sem-fundo.png", description: "Shampoo nutritivo para cabelos secos e danificados" },
    { id: 2, name: "Condicionador L'Oréal Professionnel", price: 89.50, category: "cabelo", image: "img/shampo-kerastase-semfundo3.png", description: "Condicionador reparador para cabelos tratados quimicamente" },
    { id: 3, name: "Máscara Facial La Roche-Posay", price: 156.90, category: "facial", image: "img/mascarascapilar-sem-fundo.png", description: "Máscara hidratante com ácido hialurônico" },
    { id: 4, name: "Sérum Vichy Vitamin C", price: 189.90, category: "facial", image: "img/loreal-serum-sem-fundo.png", description: "Sérum antioxidante com vitamina C pura" },
];

function loadProducts() {
    products = [...productData];
    displayProducts(products);
}

function displayProducts(productsToShow) {
    const productsGrid = document.getElementById('productsGrid');

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<div class="no-products"><p>Nenhum produto encontrado.</p></div>';
        return;
    }

    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-category="${product.category}" data-name="${product.name}">
            <div class="product-image"><img src="${product.image}"></div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                <div class="product-actions">
                    <button class="view-product" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i> Visualizar
                    </button>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Adicionar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Event listeners
function setupEventListeners() {
    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    mobileMenuBtn.addEventListener('click', function () {
        mobileMenuBtn.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.addEventListener('change', handleCategoryFilter);

    // Login button
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (isLoggedIn) {
            openModal('profileModal');
        } else {
            openModal('loginModal');
        }
    });

    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);

    // Cart overlay click
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('cart-sidebar') && e.target.id === 'cartSidebar') {
            toggleCart();
        }
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const mobileNav = document.querySelector('.mobile-nav');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                if (mobileNav.classList.contains('open')) {
                    mobileNav.classList.remove('open');
                    mobileMenuBtn.classList.remove('open');
                }
            }
        });
    });
}

// Search functionality
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;

    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
}

// Category filter
function handleCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filteredProducts = products.filter(product => {
        const matchesSearch = !searchTerm ||
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
}

// Sort products A-Z
function sortProducts() {
    const sortBtn = document.getElementById('sortBtn');
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    // Get current filtered products first
    let currentProducts = products.filter(product => {
        const matchesSearch = !searchTerm ||
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (isSortedAZ) {
        currentProducts.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'));
        sortBtn.innerHTML = '<i class="fas fa-sort-alpha-up"></i> Z-A';
        isSortedAZ = false;
    } else {
        currentProducts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        sortBtn.innerHTML = '<i class="fas fa-sort-alpha-down"></i> A-Z';
        isSortedAZ = true;
    }

    // Apply current filters after sorting
    handleSearch();
}

// Slider functionality
function startSlider() {
    setInterval(nextSlide, 5000); // Auto slide every 5 seconds
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function previousSlide() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function currentSlideFunc(n) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    currentSlide = n - 1;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartDisplay();

    // Show feedback
    showToast('Produto adicionado ao carrinho!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2).replace('.', ',');

    // Update cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Seu carrinho está vazio</div>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image"><img src="${item.image}"></div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

function saveCartToStorage() {
    localStorage.setItem('tuttibela_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('tuttibela_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Product view functionality
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = createProductModal(product);
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function createProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'productModal';

    modal.innerHTML = `
        <div class="modal-content product-modal-content">
            <span class="close-modal" onclick="closeProductModal()">&times;</span>
            <div class="product-details">
                <div class="product-image-large"><img src="${product.image}"></div>
                <div class="product-info-detailed">
                    <h2>${product.name}</h2>
                    <p class="product-description-full">${product.description}</p>
                    <div class="product-price-large">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
                    <div class="product-actions-modal">
                        <div class="quantity-selector">
                            <label>Quantidade:</label>
                            <div class="quantity-controls">
                                <button type="button" onclick="updateModalQuantity(-1)">-</button>
                                <span id="modalQuantity">1</span>
                                <button type="button" onclick="updateModalQuantity(1)">+</button>
                            </div>
                        </div>
                        <button class="buy-now-btn" onclick="buyNow(${product.id})">
                            <i class="fas fa-credit-card"></i> Comprar Agora
                        </button>
                        <button class="add-to-cart-modal" onclick="addToCartFromModal(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return modal;
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.remove();
    }
}

function updateModalQuantity(change) {
    const quantitySpan = document.getElementById('modalQuantity');
    let quantity = parseInt(quantitySpan.textContent);
    quantity = Math.max(1, quantity + change);
    quantitySpan.textContent = quantity;
}

function addToCartFromModal(productId) {
    const quantity = parseInt(document.getElementById('modalQuantity').textContent);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    saveCartToStorage();
    updateCartDisplay();
    closeProductModal();
    showToast(`${quantity}x ${product.name} adicionado ao carrinho!`);
}

function buyNow(productId) {
    addToCartFromModal(productId);
    closeProductModal();
    toggleCart();

    // Scroll to checkout button
    setTimeout(() => {
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            checkoutBtn.style.animation = 'pulse 1s infinite';
            setTimeout(() => {
                checkoutBtn.style.animation = '';
            }, 3000);
        }
    }, 300);
}

// Enhanced checkout with payment API simulation
function checkout() {
    if (!isLoggedIn) {
        showToast('Por favor, faça login para continuar com a compra.');
        openModal('loginModal');
        return;
    }

    if (cart.length === 0) {
        showToast('Seu carrinho está vazio.');
        return;
    }

    // Show payment modal
    showPaymentModal();
}

function showPaymentModal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 15.90;
    const specialDeliveryFee = 29.90;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'paymentModal';

    modal.innerHTML = `
        <div class="modal-content payment-modal-content">
            <span class="close-modal" onclick="closePaymentModal()">&times;</span>
            <div class="payment-container">
                <h3>Finalizar Compra</h3>
                <div class="order-summary">
                    <h4>Resumo do Pedido</h4>
                    ${cart.map(item => `
                        <div class="order-item-summary">
                            <span>${item.name} (${item.quantity}x)</span>
                            <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                        </div>
                    `).join('')}
                    <div class="order-item-summary">
                        <span>Subtotal:</span>
                        <span>R$ ${total.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
                
                <div class="delivery-options">
                    <h4>Opções de Entrega</h4>
                    <div class="delivery-methods">
                        <label class="delivery-option">
                            <input type="radio" name="deliveryMethod" value="normal" checked>
                            <span>📦 Entrega Normal (5-7 dias úteis) - R$ ${deliveryFee.toFixed(2).replace('.', ',')}</span>
                        </label>
                        <label class="delivery-option">
                            <input type="radio" name="deliveryMethod" value="express">
                            <span>🚀 Entrega Expressa (1-2 dias úteis) - R$ ${specialDeliveryFee.toFixed(2).replace('.', ',')}</span>
                        </label>
                        <label class="delivery-option">
                            <input type="radio" name="deliveryMethod" value="pickup">
                            <span>🏪 Retirar na Loja - GRÁTIS</span>
                        </label>
                    </div>
                </div>
                
                <div class="final-total">
                    <h4>Total Final: <span id="finalTotal">R$ ${(total + deliveryFee).toFixed(2).replace('.', ',')}</span></h4>
                </div>
                
                <div class="payment-methods">
                    <h4>Forma de Pagamento</h4>
                    <div class="payment-options">
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod" value="credit" checked>
                            <span>💳 Cartão de Crédito</span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod" value="debit">
                            <span>💳 Cartão de Débito</span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod" value="pix">
                            <span>📱 PIX</span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="paymentMethod" value="boleto">
                            <span>📄 Boleto Bancário</span>
                        </label>
                    </div>
                </div>
                
                <div class="payment-form" id="paymentForm">
                    <div class="form-group">
                        <input type="text" placeholder="Nome no Cartão" required>
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Número do Cartão" maxlength="19" required>
                    </div>
                    <div class="form-group-row">
                        <input type="text" placeholder="MM/AA" maxlength="5" required>
                        <input type="text" placeholder="CVV" maxlength="4" required>
                    </div>
                </div>
                
                <button class="process-payment-btn" onclick="processPaymentAPI()">
                    <i class="fas fa-lock"></i> Finalizar Pagamento
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Add payment method change listener
    const paymentOptions = modal.querySelectorAll('input[name="paymentMethod"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', updatePaymentForm);
    });

    // Add delivery method change listener
    const deliveryOptions = modal.querySelectorAll('input[name="deliveryMethod"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', updateDeliveryTotal);
    });
}

function updatePaymentForm() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const paymentForm = document.getElementById('paymentForm');

    switch (paymentMethod) {
        case 'credit':
        case 'debit':
            paymentForm.innerHTML = `
                <div class="form-group">
                    <input type="text" placeholder="Nome no Cartão" required>
                </div>
                <div class="form-group">
                    <input type="text" placeholder="Número do Cartão" maxlength="19" required>
                </div>
                <div class="form-group-row">
                    <input type="text" placeholder="MM/AA" maxlength="5" required>
                    <input type="text" placeholder="CVV" maxlength="4" required>
                </div>
            `;
            break;
        case 'pix':
            paymentForm.innerHTML = `
                <div class="pix-info">
                    <p>Você será redirecionado para completar o pagamento via PIX.</p>
                    <div class="pix-qr">📱 QR Code será gerado após confirmar</div>
                </div>
            `;
            break;
        case 'boleto':
            paymentForm.innerHTML = `
                <div class="boleto-info">
                    <p>O boleto será gerado após a confirmação do pedido.</p>
                    <p><small>Prazo de pagamento: 3 dias úteis</small></p>
                </div>
            `;
            break;
    }
}

function updateDeliveryTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
    const finalTotalElement = document.getElementById('finalTotal');

    let deliveryFee = 0;

    switch (deliveryMethod) {
        case 'normal':
            deliveryFee = 15.90;
            break;
        case 'express':
            deliveryFee = 29.90;
            break;
        case 'pickup':
            deliveryFee = 0;
            break;
    }

    const finalTotal = total + deliveryFee;
    finalTotalElement.textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;

    // Update button text
    const processBtn = document.querySelector('.process-payment-btn');
    if (processBtn && !processBtn.disabled) {
        processBtn.innerHTML = `<i class="fas fa-lock"></i> Pagar R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
    }
}

function processPaymentAPI() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let deliveryFee = 0;
    let deliveryText = '';

    switch (deliveryMethod) {
        case 'normal':
            deliveryFee = 15.90;
            deliveryText = 'Entrega Normal (5-7 dias úteis)';
            break;
        case 'express':
            deliveryFee = 29.90;
            deliveryText = 'Entrega Expressa (1-2 dias úteis)';
            break;
        case 'pickup':
            deliveryFee = 0;
            deliveryText = 'Retirar na Loja';
            break;
    }

    const finalTotal = total + deliveryFee;

    // Show loading
    const processBtn = document.querySelector('.process-payment-btn');
    processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    processBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Create order
        const order = {
            id: Date.now(),
            date: new Date().toLocaleDateString('pt-BR'),
            items: [...cart],
            subtotal: total,
            deliveryFee: deliveryFee,
            deliveryMethod: deliveryText,
            total: finalTotal,
            paymentMethod: paymentMethod,
            status: 'completed'
        };

        // Save order
        saveOrder(order);

        // Clear cart
        cart = [];
        saveCartToStorage();
        updateCartDisplay();

        // Close modals
        closePaymentModal();
        toggleCart();

        // Show success
        showPaymentSuccess(order);

    }, 2000);
}

function showPaymentSuccess(order) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'successModal';

    modal.innerHTML = `
        <div class="modal-content success-modal-content">
            <div class="success-container">
                <div class="success-icon">✅</div>
                <h2>Pagamento Aprovado!</h2>
                <p>Seu pedido foi realizado com sucesso.</p>
                <div class="order-details">
                    <p><strong>Pedido:</strong> #${order.id}</p>
                    <p><strong>Subtotal:</strong> R$ ${order.subtotal.toFixed(2).replace('.', ',')}</p>
                    <p><strong>Entrega:</strong> ${order.deliveryMethod} - R$ ${order.deliveryFee.toFixed(2).replace('.', ',')}</p>
                    <p><strong>Total:</strong> R$ ${order.total.toFixed(2).replace('.', ',')}</p>
                    <p><strong>Forma de Pagamento:</strong> ${getPaymentMethodText(order.paymentMethod)}</p>
                </div>
                <button class="close-success-btn" onclick="closeSuccessModal()">
                    Continuar Comprando
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Auto close after 5 seconds
    setTimeout(() => {
        closeSuccessModal();
    }, 5000);
}

function getPaymentMethodText(method) {
    const methods = {
        'credit': 'Cartão de Crédito',
        'debit': 'Cartão de Débito',
        'pix': 'PIX',
        'boleto': 'Boleto Bancário'
    };
    return methods[method] || method;
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.remove();
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.remove();
    }
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;

    // Simulate login validation
    if (email && password) {
        currentUser = {
            id: 1,
            name: 'Cliente Teste',
            email: email,
            phone: '',
            address: ''
        };

        isLoggedIn = true;
        localStorage.setItem('tuttibela_user', JSON.stringify(currentUser));
        localStorage.setItem('tuttibela_logged_in', 'true');

        updateLoginStatus();
        closeModal('loginModal');
        showToast('Login realizado com sucesso!');
    } else {
        showToast('Por favor, preencha todos os campos.');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[placeholder="Nome completo"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        showToast('As senhas não coincidem.');
        return;
    }

    // Simulate user registration
    currentUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: '',
        address: ''
    };

    isLoggedIn = true;
    localStorage.setItem('tuttibela_user', JSON.stringify(currentUser));
    localStorage.setItem('tuttibela_logged_in', 'true');

    updateLoginStatus();
    closeModal('loginModal');
    showToast('Cadastro realizado com sucesso!');
}

function handleProfileUpdate(e) {
    e.preventDefault();

    if (!isLoggedIn) return;

    const form = e.target;
    currentUser.name = form.querySelector('#userName').value;
    currentUser.email = form.querySelector('#userEmail').value;
    currentUser.phone = form.querySelector('#userPhone').value;
    currentUser.address = form.querySelector('#userAddress').value;

    localStorage.setItem('tuttibela_user', JSON.stringify(currentUser));
    showToast('Perfil atualizado com sucesso!');
}

function checkLoginStatus() {
    const loggedIn = localStorage.getItem('tuttibela_logged_in');
    const userData = localStorage.getItem('tuttibela_user');

    if (loggedIn === 'true' && userData) {
        isLoggedIn = true;
        currentUser = JSON.parse(userData);
        updateLoginStatus();
    }
}

function updateLoginStatus() {
    const loginBtn = document.querySelector('.login-btn');

    if (isLoggedIn && currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        loadUserProfile();
    } else {
        loginBtn.innerHTML = '<i class="fas fa-user"></i> Minha Conta';
    }
}

function loadUserProfile() {
    if (!currentUser) return;

    document.getElementById('userName').value = currentUser.name || '';
    document.getElementById('userEmail').value = currentUser.email || '';
    document.getElementById('userPhone').value = currentUser.phone || '';
    document.getElementById('userAddress').value = currentUser.address || '';

    loadUserOrders();
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('tuttibela_user');
    localStorage.removeItem('tuttibela_logged_in');
    localStorage.removeItem('tuttibela_orders');

    updateLoginStatus();
    closeModal('profileModal');
    showToast('Logout realizado com sucesso!');
}

// Order management
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('tuttibela_orders')) || [];
    orders.push(order);
    localStorage.setItem('tuttibela_orders', JSON.stringify(orders));
}

function updateOrderStatus(updatedOrder) {
    let orders = JSON.parse(localStorage.getItem('tuttibela_orders')) || [];
    const index = orders.findIndex(order => order.id === updatedOrder.id);
    if (index !== -1) {
        orders[index] = updatedOrder;
        localStorage.setItem('tuttibela_orders', JSON.stringify(orders));
    }
}

function loadUserOrders() {
    const orders = JSON.parse(localStorage.getItem('tuttibela_orders')) || [];
    const ordersList = document.getElementById('ordersList');

    if (orders.length === 0) {
        ordersList.innerHTML = '<div class="no-orders"><p>Você ainda não fez nenhum pedido.</p></div>';
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <div class="order-number">Pedido #${order.id}</div>
                <div class="order-status ${order.status}">${getStatusText(order.status)}</div>
            </div>
            <div class="order-date">Data: ${order.date}</div>
            <div class="order-delivery">Entrega: ${order.deliveryMethod || 'Entrega Normal'}</div>
            <div class="order-total">Total: R$ ${order.total.toFixed(2).replace('.', ',')}</div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-detail">
                        ${item.name} - Qtd: ${item.quantity}
                    </div>
                `).join('')}
            </div>
        </div>
    `).reverse().join('');
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendente',
        'completed': 'Concluído',
        'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
}

// Modal functionality
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Tab functionality
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.style.display = 'none');

    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').style.display = 'block';
}

function showProfileTab(tabName) {
    const tabs = document.querySelectorAll('.profile-tabs .tab-btn');
    const contents = document.querySelectorAll('#profileModal .tab-content');

    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.style.display = 'none');

    event.target.classList.add('active');
    document.getElementById('profile' + tabName.charAt(0).toUpperCase() + tabName.slice(1) + 'Tab').style.display = 'block';

    if (tabName === 'orders') {
        loadUserOrders();
    }
}

// Toast notifications
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 4000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.transform = 'translateX(0)';

    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
    }, 3000);
}

// Window click events
window.onclick = function (event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Expose functions to global scope for onclick handlers
window.nextSlide = nextSlide;
window.previousSlide = previousSlide;
window.currentSlide = currentSlideFunc;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.sortProducts = sortProducts;
window.openModal = openModal;
window.closeModal = closeModal;
window.showTab = showTab;
window.showProfileTab = showProfileTab;
window.logout = logout;

// Expose new functions to global scope
window.viewProduct = viewProduct;
window.closeProductModal = closeProductModal;
window.updateModalQuantity = updateModalQuantity;
window.addToCartFromModal = addToCartFromModal;
window.buyNow = buyNow;
window.closePaymentModal = closePaymentModal;
window.closeSuccessModal = closeSuccessModal;
window.processPaymentAPI = processPaymentAPI;