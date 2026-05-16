const Filter = {
    apply(products, criteria) {
        let filtered = [...products];

        // Search
        if (criteria.search) {
            const query = criteria.search.toLowerCase();
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query)
            );
        }

        // Category
        if (criteria.category && criteria.category !== 'All') {
            filtered = filtered.filter(p => p.category === criteria.category);
        }

        // Price Range
        if (criteria.maxPrice) {
            filtered = filtered.filter(p => p.price <= criteria.maxPrice);
        }

        // Rating
        if (criteria.minRating) {
            filtered = filtered.filter(p => p.rating >= criteria.minRating);
        }

        // Stock
        if (criteria.inStockOnly) {
            filtered = filtered.filter(p => p.stock > 0);
        }

        // Sorting
        switch (criteria.sort) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                filtered.sort((a, b) => b.id - a.id);
                break;
        }

        return filtered;
    }
};

export default Filter;
