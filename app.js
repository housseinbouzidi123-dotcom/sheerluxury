// --- State Management ---
let cart = JSON.parse(localStorage.getItem('sheerLuxuryCart')) || [];

// --- DOM Elements ---
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
const cartIcon = document.querySelector('.cart-icon');
const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.querySelector('.close-cart-btn');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.querySelector('.cart-count');
const checkoutBtn = document.querySelector('.checkout-btn');
const userInfoModal = document.getElementById('userInfoModal');
const userInfoCloseBtn = userInfoModal.querySelector('.user-info-close');
const userInfoForm = document.getElementById('userInfoForm');
const fullNameInput = document.getElementById('fullName');
const addressInput = document.getElementById('address');
const phoneInput = document.getElementById('phone');
const fullNameErrorUserInfo = document.getElementById('fullNameErrorUserInfo');
const addressErrorUserInfo = document.getElementById('addressErrorUserInfo');
const phoneErrorUserInfo = document.getElementById('phoneErrorUserInfo');

// --- Contact Form DOM Elements ---
const navContactLink = document.getElementById('navContactLink');
const contactModal = document.getElementById('contactModal');
const contactCloseBtn = contactModal ? contactModal.querySelector('.contact-close') : null;
const contactForm = document.getElementById('contactForm');
const contactFullName = document.getElementById('contactFullName');
const contactEmail = document.getElementById('contactEmail');
const contactMessage = document.getElementById('contactMessage');
const fullNameError = document.getElementById('fullNameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

// --- Toast Notification Setup ---
let toastContainer = document.getElementById('toast-container');
if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
}

// --- Toast Function ---
const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    
    let icon = '';
    if (type === 'success') {
        icon = '<i class="fas fa-check-circle"></i>';
    } else if (type === 'error') {
        icon = '<i class="fas fa-exclamation-circle"></i>';
    }

    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10); // Small delay to trigger CSS transition

    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000); // Disappear after 3 seconds
};


// --- Mobile Menu Toggle ---
if (mobileMenuBtn && mainNav) {
    const menuIcon = mobileMenuBtn.querySelector('i');
    mobileMenuBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        mainNav.classList.toggle('active');
        menuIcon.classList.toggle('fa-bars');
        menuIcon.classList.toggle('fa-times');
        document.body.classList.toggle('no-scroll');
    });
}

// --- Cart UI Functions ---
const openCart = () => {
    cartPanel.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
};

const closeCart = () => {
    cartPanel.classList.remove('active');
    cartOverlay.classList.remove('active');
    if (!userInfoModal.classList.contains('active') && !contactModal.classList.contains('active')) {
        document.body.classList.remove('no-scroll');
    }
};

// --- User Info Modal UI Functions ---
const openUserInfoModal = () => {
    userInfoModal.classList.add('active');
    document.body.classList.add('no-scroll');
};

const closeUserInfoModal = () => {
    userInfoModal.classList.remove('active');
    if (!cartPanel.classList.contains('active') && !contactModal.classList.contains('active')) {
        document.body.classList.remove('no-scroll');
    }
};

// --- Contact Modal UI Functions ---
const openContactModal = () => {
    contactModal.classList.add('active');
    document.body.classList.add('no-scroll');
};

const closeContactModal = () => {
    contactModal.classList.remove('active');
    if (!cartPanel.classList.contains('active') && !userInfoModal.classList.contains('active')) {
        document.body.classList.remove('no-scroll');
    }
};

const isValidEmail = (email) => {
    // Basic email regex for validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateContactForm = () => {
    let isValid = true;

    // Validate Full Name
    if (contactFullName.value.trim().length < 2) {
        fullNameError.textContent = 'الاسم الكامل مطلوب (على الأقل حرفين).';
        fullNameError.style.display = 'block';
        isValid = false;
    } else {
        fullNameError.textContent = '';
        fullNameError.style.display = 'none';
    }

    // Validate Email
    if (!isValidEmail(contactEmail.value.trim())) {
        emailError.textContent = 'البريد الإلكتروني غير صالح.';
        emailError.style.display = 'block';
        isValid = false;
    } else {
        emailError.textContent = '';
        emailError.style.display = 'none';
    }

    // Validate Message
    if (contactMessage.value.trim().length < 10) {
        messageError.textContent = 'الرسالة مطلوبة (على الأقل 10 أحرف).';
        messageError.style.display = 'block';
        isValid = false;
    } else {
        messageError.textContent = '';
        messageError.style.display = 'none';
    }

    return isValid;
};

const validateUserInfoForm = () => {
    let isValid = true;

    // Validate Full Name
    if (fullNameInput.value.trim().length < 2) {
        fullNameErrorUserInfo.textContent = 'الاسم الكامل مطلوب (على الأقل حرفين).';
        fullNameErrorUserInfo.style.display = 'block';
        isValid = false;
    } else {
        fullNameErrorUserInfo.textContent = '';
        fullNameErrorUserInfo.style.display = 'none';
    }

    // Validate Address
    if (addressInput.value.trim().length < 5) {
        addressErrorUserInfo.textContent = 'العنوان مطلوب (على الأقل 5 أحرف).';
        addressErrorUserInfo.style.display = 'block';
        isValid = false;
    } else {
        addressErrorUserInfo.textContent = '';
        addressErrorUserInfo.style.display = 'none';
    }

    // Validate Phone Number
    // Basic phone number validation (e.g., at least 7 digits, can be improved)
    if (!/^\d{7,}$/.test(phoneInput.value.trim())) {
        phoneErrorUserInfo.textContent = 'رقم الهاتف غير صالح (يجب أن يحتوي على الأقل 7 أرقام).';
        phoneErrorUserInfo.style.display = 'block';
        isValid = false;
    } else {
        phoneErrorUserInfo.textContent = '';
        phoneErrorUserInfo.style.display = 'none';
    }

    return isValid;
};

// --- Cart Logic Functions ---
const renderCart = () => {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--color-light-gray);">سلتك فارغة.</p>';
        updateCartSummary();
        localStorage.setItem('sheerLuxuryCart', JSON.stringify(cart)); /* Save after empty render */
        return;
    }
    cart.forEach(item => {
        const cartItemHTML = `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${item.price} MAD</p>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease-qty" data-id="${item.id}">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn increase-qty" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>`;
        cartItemsContainer.innerHTML += cartItemHTML;
    });
    updateCartSummary();
    localStorage.setItem('sheerLuxuryCart', JSON.stringify(cart)); /* Save after full render */
};

const updateCartSummary = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = `${total} MAD`;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
};

const addToCart = (id, name, price, image) => {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    renderCart(); // renderCart will save to localStorage
};

const updateQuantity = (id, change) => {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.id !== id);
        }
    }
    renderCart(); // renderCart will save to localStorage
};

// --- Event Listeners ---
cartIcon.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const { id, name, price, image } = e.target.dataset;
        addToCart(id, name, parseFloat(price), image);
    });
});

cartItemsContainer.addEventListener('click', (e) => {
    const target = e.target.closest('[data-id]');
    if (!target) return;
    const id = target.dataset.id;
    if (target.matches('.increase-qty')) updateQuantity(id, 1);
    if (target.matches('.decrease-qty')) updateQuantity(id, -1);
    if (target.matches('.remove-item-btn') || target.parentElement.matches('.remove-item-btn')) { // Added parentElement check for icon clicks
        cart = cart.filter(item => item.id !== id);
        renderCart(); // renderCart will save to localStorage
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        closeCart();
        openUserInfoModal();
    } else {
        showToast('سلتك فارغة!', 'error'); // Changed from alert to toast
    }
});

userInfoCloseBtn.addEventListener('click', closeUserInfoModal);
userInfoModal.addEventListener('click', (event) => {
    if (event.target === userInfoModal) closeUserInfoModal();
});

userInfoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (validateUserInfoForm()) {
        const orderData = { // Renamed from formData to orderData for clarity
            fullName: fullNameInput.value.trim(),
            address: addressInput.value.trim(),
            phone: phoneInput.value.trim(),
            cart: cart // Add the current cart data
        };

        try {
            const response = await fetch('http://localhost:3000/send-order-confirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData) // Send orderData
            });

            const result = await response.json();

            if (response.ok) {
                showToast(result.message, 'success');
                closeUserInfoModal();
                userInfoForm.reset();
                cart = [];
                renderCart();
            } else {
                showToast(`فشل تأكيد الطلب: ${result.message || 'حدث خطأ غير متوقع.'}`, 'error');
            }
        } catch (error) {
            console.error('Error submitting order confirmation:', error);
            showToast('فشل تأكيد الطلب: تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقًا.', 'error');
        }
    }
});

// --- Contact Form Event Listeners ---
// Re-adding this block with the correct behavior
if (navContactLink && contactModal) {
    navContactLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor link behavior (no page reload)
        closeCart(); // Close cart if open
        closeUserInfoModal(); // Close user info modal if open
        openContactModal();
    });
}

if (contactCloseBtn) {
    contactCloseBtn.addEventListener('click', closeContactModal);
}

if (contactModal) {
    contactModal.addEventListener('click', (event) => {
        if (event.target === contactModal) closeContactModal();
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => { // Added 'async'
        event.preventDefault(); // Prevent default form submission
        if (validateContactForm()) {
            const formData = {
                fullName: contactFullName.value.trim(),
                email: contactEmail.value.trim(),
                message: contactMessage.value.trim()
            };

            try {
                const response = await fetch('http://localhost:3000/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) { // Check if HTTP status is 2xx
                    showToast(result.message, 'success'); // Changed from alert to toast
                    contactForm.reset(); // Clear the form
                    closeContactModal();
                } else {
                    showToast(`فشل الإرسال: ${result.message || 'حدث خطأ غير متوقع.'}`, 'error'); // Changed from alert to toast
                }
            } catch (error) {
                console.error('Error submitting contact form:', error);
                showToast('فشل الإرسال: تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقًا.', 'error'); // Changed from alert to toast
                // Also reset form if there's a connection error so user can re-try
                contactForm.reset();
            }
        }
    });
}

// --- Scroll to Best Sellers Logic ---
const shopNowBtn = document.getElementById('shopNowBtn');
const bestSellersSection = document.getElementById('bestSellersSection');

if (shopNowBtn && bestSellersSection) {
    shopNowBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor link behavior
        bestSellersSection.scrollIntoView({ behavior: 'smooth' });
    });
}

const navBestSellersLink = document.getElementById('navBestSellersLink');
if (navBestSellersLink && bestSellersSection) {
    navBestSellersLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor link behavior
        bestSellersSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderCart(); // Keep the initial cart render
});
