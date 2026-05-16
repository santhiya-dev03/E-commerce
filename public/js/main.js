document.addEventListener('DOMContentLoaded', async () => {
    const productGrid = document.getElementById('product-grid');
    const authLinks = document.getElementById('auth-links');
    const cartCount = document.getElementById('cart-count');

    // 1. Check Auth
    try {
        const data = await API.get('/auth/me');
        if (data.user) {
            authLinks.innerHTML = `
                <span>Welcome, ${data.user.name}</span>
                <a href="#" id="logout-btn">Logout</a>
            `;
            document.getElementById('logout-btn').addEventListener('click', async (e) => {
                e.preventDefault();
                await API.post('/auth/logout');
                window.location.reload();
            });

            // Load Cart Count
            const cart = await API.get('/cart');
            cartCount.textContent = cart.length || 0;
        }
    } catch (err) {
        console.log('User not logged in');
    }

    // 2. Load Products
    try {
        const products = await API.get('/products');
        productGrid.innerHTML = '';

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image_url}" alt="${product.name}" class="product-image">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price}</p>
                    <div style="display: flex; gap: 0.8rem; margin-top: auto;">
                        <a href="/product.html?id=${product.id}" class="btn btn-outline" style="flex: 1;">Details</a>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}" style="flex: 2;">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });

        // Add to Cart Event
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', async () => {
                const productId = btn.dataset.id;
                const res = await API.post('/cart', { product_id: productId, quantity: 1 });
                if (res.error) {
                    if (res.error.includes('Not authorized')) {
                        alert('Please login to add items to cart');
                        window.location.href = '/login.html';
                    } else {
                        alert(res.error);
                    }
                } else {
                    alert('Added to cart!');
                    window.location.reload();
                }
            });
        });

    } catch (err) {
        productGrid.innerHTML = '<p>Failed to load products.</p>';
    }
});
