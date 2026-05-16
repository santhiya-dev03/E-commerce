import UI from './ui.js';

const Cart = {
    items: JSON.parse(localStorage.getItem('serene_cart')) || [],

    add(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.save();
        UI.showToast('Added to cart');
    },

    remove(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
    },

    updateQuantity(id, change) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) this.remove(id);
            this.save();
        }
    },

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    save() {
        localStorage.setItem('serene_cart', JSON.stringify(this.items));
        document.dispatchEvent(new CustomEvent('cartUpdated'));
    },

    clear() {
        this.items = [];
        this.save();
    }
};

export default Cart;
