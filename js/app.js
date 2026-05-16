import products from './products.js';
import Cart from './cart.js';
import Wishlist from './wishlist.js';
import Filter from './filter.js';

const App = {
    state: {
        filter: {
            search: '',
            category: 'All',
            maxPrice: 100000,
            minRating: 0,
            inStockOnly: false,
            sort: 'newest'
        },
        view: 'grid' // grid or list
    },

    init() {
        this.renderProducts(products);
        this.setupEventListeners();
        this.updateCartBadge();
        this.renderCart();
        this.renderCategories();
    },

    renderProducts(data) {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        if (data.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }

        data.forEach(product => {
            const card = this.createProductCard(product);
            grid.appendChild(card);
        });

        // Initialize lazy loading for images
        this.initLazyLoading();
    },

    createProductCard(p) {
        const card = document.createElement('div');
        card.className = 'product-card animate-in';
        const isWishlisted = Wishlist.isInWishlist(p.id);
        const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

        card.innerHTML = `
            <div class="product-image-container">
                <img data-src="${p.image}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="${p.title}" class="lazy-img">
                ${p.badge ? `<span class="badge ${p.badge.toLowerCase()}">${p.badge}</span>` : ''}
                ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
                <div class="product-actions">
                    <button class="action-btn wishlist-toggle ${isWishlisted ? 'active' : ''}" data-id="${p.id}" title="Add to Wishlist">
                        <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="action-btn quick-view" data-id="${p.id}" title="Quick View">
                        <i class="far fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <h3 class="product-title">${p.title}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${this.renderStars(p.rating)}
                    </div>
                    <span class="rating-value">(${p.rating})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">₹${p.price.toLocaleString('en-IN')}</span>
                    ${p.originalPrice > p.price ? `<span class="old-price">₹${p.originalPrice.toLocaleString('en-IN')}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" data-id="${p.id}">
                    <i class="fas fa-shopping-bag"></i> Add to Cart
                </button>
            </div>
        `;

        // Event Listeners for the card
        card.querySelector('.add-to-cart-btn').onclick = (e) => {
            e.stopPropagation();
            Cart.add(p);
        };

        card.querySelector('.wishlist-toggle').onclick = (e) => {
            e.stopPropagation();
            Wishlist.toggle(p);
            const icon = e.currentTarget.querySelector('i');
            icon.classList.toggle('fas');
            icon.classList.toggle('far');
            e.currentTarget.classList.toggle('active');
        };

        card.querySelector('.quick-view').onclick = () => this.showProductModal(p);

        return card;
    },

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - rating < 1) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    },

    renderCategories() {
        const container = document.getElementById('category-tabs');
        if (!container) return;

        const categories = ['All', 'New Arrivals', 'Best Sellers', 'Tech Gear'];
        container.innerHTML = categories.map(cat => `
            <button class="category-tab ${this.state.filter.category === cat ? 'active' : ''}" data-category="${cat}">
                ${cat}
            </button>
        `).join('');

        container.querySelectorAll('.category-tab').forEach(btn => {
            btn.onclick = () => {
                this.state.filter.category = btn.dataset.category;
                this.handleFilterChange();
                container.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            };
        });
    },

    handleFilterChange() {
        const filtered = Filter.apply(products, this.state.filter);
        this.renderProducts(filtered);
    },

    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.oninput = (e) => {
                this.state.filter.search = e.target.value;
                this.handleFilterChange();
            };
        }

        // Sort
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.onchange = (e) => {
                this.state.filter.sort = e.target.value;
                this.handleFilterChange();
            };
        }

        // Price Filter
        const priceRange = document.getElementById('price-range');
        if (priceRange) {
            priceRange.oninput = (e) => {
                this.state.filter.maxPrice = parseInt(e.target.value);
                document.getElementById('price-value').textContent = `₹${this.state.filter.maxPrice.toLocaleString('en-IN')}`;
                this.handleFilterChange();
            };
        }

        // Cart Sidebar Toggle
        const cartBtn = document.getElementById('cart-btn');
        const cartClose = document.getElementById('close-cart');
        const cartSidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('overlay');

        if (cartBtn) cartBtn.onclick = () => {
            cartSidebar.classList.add('open');
            overlay.classList.add('active');
        };

        if (cartClose) cartClose.onclick = () => {
            cartSidebar.classList.remove('open');
            overlay.classList.remove('active');
        };

        if (overlay) overlay.onclick = () => {
            cartSidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.getElementById('product-modal').classList.remove('active');
        };

        // Listen for data updates
        document.addEventListener('cartUpdated', () => {
            this.updateCartBadge();
            this.renderCart();
        });
    },

    updateCartBadge() {
        const badge = document.getElementById('cart-count');
        if (badge) badge.textContent = Cart.getCount();
    },

    renderCart() {
        const container = document.getElementById('cart-items');
        const totalContainer = document.getElementById('cart-total');
        if (!container) return;

        if (Cart.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Your cart is empty</p>
                    <button class="btn btn-primary" onclick="document.getElementById('close-cart').click()">Continue Shopping</button>
                </div>
            `;
            totalContainer.textContent = '₹0';
            return;
        }

        container.innerHTML = Cart.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="item-details">
                    <h4>${item.title}</h4>
                    <p>₹${item.price.toLocaleString('en-IN')}</p>
                    <div class="quantity-controls">
                        <button class="qty-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
        `).join('');

        totalContainer.textContent = `₹${Cart.getTotal().toLocaleString('en-IN')}`;

        // Cart Actions
        container.querySelectorAll('.qty-btn').forEach(btn => {
            btn.onclick = () => {
                const id = parseInt(btn.dataset.id);
                Cart.updateQuantity(id, btn.classList.contains('plus') ? 1 : -1);
            };
        });

        container.querySelectorAll('.remove-item').forEach(btn => {
            btn.onclick = () => Cart.remove(parseInt(btn.dataset.id));
        });
    },

    showProductModal(p) {
        const modal = document.getElementById('product-modal');
        const overlay = document.getElementById('overlay');
        const relatedContainer = document.getElementById('related-products');

        modal.querySelector('.modal-image').src = p.image;
        modal.querySelector('.modal-title').textContent = p.title;
        modal.querySelector('.modal-description').textContent = p.description;
        modal.querySelector('.modal-price').textContent = `₹${p.price.toLocaleString('en-IN')}`;
        modal.querySelector('.modal-old-price').textContent = p.originalPrice > p.price ? `₹${p.originalPrice.toLocaleString('en-IN')}` : '';
        modal.querySelector('.modal-rating').innerHTML = this.renderStars(p.rating) + ` (${p.rating})`;
        modal.querySelector('.modal-stock').textContent = p.stock > 0 ? `In Stock (${p.stock} units)` : 'Out of Stock';

        // Add to Cart in modal
        modal.querySelector('.modal-add-btn').onclick = () => Cart.add(p);

        // Related Products
        const related = products
            .filter(item => item.category === p.category && item.id !== p.id)
            .slice(0, 4);
        
        relatedContainer.innerHTML = related.map(item => `
            <div class="related-item" onclick="document.dispatchEvent(new CustomEvent('showProduct', {detail: ${item.id}}))">
                <img src="${item.image}" alt="${item.title}">
                <h5>${item.title}</h5>
                <p>₹${item.price.toLocaleString('en-IN')}</p>
            </div>
        `).join('');

        modal.classList.add('active');
        overlay.classList.add('active');

        modal.querySelector('.close-modal').onclick = () => {
            modal.classList.remove('active');
            overlay.classList.remove('active');
        };
    },

    initLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('.lazy-img').forEach(img => observer.observe(img));
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
document.addEventListener('showProduct', (e) => {
    const p = products.find(item => item.id === e.detail);
    if (p) App.showProductModal(p);
});
