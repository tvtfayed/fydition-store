// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Shopping Cart Functionality
let cart = [];
let cartTotal = 0;

// Cart Modal Elements
const cartModal = document.getElementById('cartModal');
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const closeModal = document.querySelector('.close');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

// Add to Cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.getAttribute('data-product');
        const productPrice = parseFloat(this.getAttribute('data-price'));
        
        addToCart(productName, productPrice);
        showNotification('تم إضافة المنتج إلى السلة!');
    });
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartUI();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartUI();
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart total
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = cartTotal;
    
    // Update cart items display
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; opacity: 0.7;">السلة فارغة</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>الكمية: ${item.quantity} × ${item.price} ريال</p>
                </div>
                <button onclick="removeFromCart('${item.name}')" style="background: #ff4757; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
}

// Cart Modal Events
cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

clearCartBtn.addEventListener('click', () => {
    cart = [];
    updateCartUI();
    showNotification('تم إفراغ السلة!');
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('السلة فارغة!', 'error');
        return;
    }
    
    // Show payment instructions modal
    showPaymentInstructions();
    cart = [];
    updateCartUI();
    cartModal.style.display = 'none';
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(20, 20, 20, 0.98)';
    } else {
        header.style.background = 'rgba(20, 20, 20, 0.95)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .portfolio-item, .product-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Initialize cart UI
updateCartUI();

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading animation
const loadingStyles = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #141414;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: '';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border: 3px solid rgba(149, 214, 234, 0.3);
        border-top: 3px solid #95D6EA;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 10000;
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);


// Payment Instructions Modal
function showPaymentInstructions() {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <div class="payment-modal-header">
                <h3>تعليمات إتمام الشراء</h3>
                <span class="payment-close">&times;</span>
            </div>
            <div class="payment-modal-body">
                <div class="payment-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4>املأ نموذج الطلب</h4>
                        <p>اضغط على الزر أدناه لملء نموذج الطلب مع بياناتك</p>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLScXXuedx8AyFf7cpjc49hAXHbOC7n-T12WO8KD0CXgn4RArKQ/viewform?usp=dialog" target="_blank" class="btn btn-primary">
                            <i class="fas fa-external-link-alt"></i> ملء النموذج
                        </a>
                    </div>
                </div>
                
                <div class="payment-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4>انضم إلى الديسكورد</h4>
                        <p>انضم إلى خادم الديسكورد الخاص بنا</p>
                        <a href="https://discord.gg/phBdT5s8y2" target="_blank" class="btn btn-secondary">
                            <i class="fab fa-discord"></i> انضم للديسكورد
                        </a>
                    </div>
                </div>
                
                <div class="payment-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h4>افتح تذكرة دعم</h4>
                        <p>بعد الانضمام، افتح تذكرة دعم جديدة كما هو موضح في الصورة أدناه:</p>
                        <div class="discord-guide">
                            <img src="assets/images/discord-ticket-guide.png" alt="كيفية فتح تذكرة في الديسكورد" class="guide-image">
                            <p class="guide-text">اضغط على أيقونة "🎫" في قناة التذاكر وأرسل رقم طلبك من النموذج</p>
                        </div>
                    </div>
                </div>
                
                <div class="payment-note">
                    <i class="fas fa-info-circle"></i>
                    <p>سيتم التواصل معك خلال 24 ساعة لإتمام عملية الشراء وتسليم المنتج</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.payment-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}


// Portfolio Modal Functions
function openPortfolioModal(imageSrc, title, description, format, dimensions, year) {
    const modal = document.getElementById('portfolioModal');
    const modalImage = document.getElementById('portfolioModalImage');
    const modalTitle = document.getElementById('portfolioModalTitle');
    const modalDescription = document.getElementById('portfolioModalDescription');
    const modalFormat = document.getElementById('portfolioModalFormat');
    const modalDimensions = document.getElementById('portfolioModalDimensions');
    const modalYear = document.getElementById('portfolioModalYear');
    
    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalFormat.textContent = format;
    modalDimensions.textContent = dimensions;
    modalYear.textContent = year;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('portfolioModal');
    if (event.target === modal) {
        closePortfolioModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePortfolioModal();
    }
});

