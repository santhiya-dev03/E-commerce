const Wishlist = {
    items: JSON.parse(localStorage.getItem('serene_wishlist')) || [],

    toggle(product) {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index === -1) {
            this.items.push(product);
            this.notify('Added to wishlist');
        } else {
            this.items.splice(index, 1);
            this.notify('Removed from wishlist');
        }
        this.save();
    },

    isInWishlist(id) {
        return this.items.some(item => item.id === id);
    },

    save() {
        localStorage.setItem('serene_wishlist', JSON.stringify(this.items));
        document.dispatchEvent(new CustomEvent('wishlistUpdated'));
    },

    notify(message) {
        const toast = document.createElement('div');
        toast.className = 'toast show wishlist-toast';
        toast.innerHTML = `<i class="fas fa-heart"></i> ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};

export default Wishlist;
