import UI from './ui.js';

const Wishlist = {
    items: JSON.parse(localStorage.getItem('serene_wishlist')) || [],

    toggle(product) {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index === -1) {
            this.items.push(product);
            UI.showToast('Added to wishlist');
        } else {
            this.items.splice(index, 1);
            UI.showToast('Removed from wishlist', 'info');
        }
        this.save();
    },

    isInWishlist(id) {
        return this.items.some(item => item.id === id);
    },

    save() {
        localStorage.setItem('serene_wishlist', JSON.stringify(this.items));
        document.dispatchEvent(new CustomEvent('wishlistUpdated'));
    }
};

export default Wishlist;
