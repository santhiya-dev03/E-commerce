const getCart = async (req, res) => {
    try {
        const { data: cartItems, error } = await req.supabase
            .from('cart_items')
            .select('*, products(*)')
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json(cartItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addToCart = async (req, res) => {
    const { product_id, quantity } = req.body;
    try {
        // Check if item already exists
        const { data: existingItem } = await req.supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('product_id', product_id)
            .single();

        if (existingItem) {
            const { data, error } = await req.supabase
                .from('cart_items')
                .update({ quantity: existingItem.quantity + (quantity || 1) })
                .eq('id', existingItem.id)
                .select()
                .single();
            if (error) throw error;
            return res.json(data);
        }

        const { data, error } = await req.supabase
            .from('cart_items')
            .insert([{ user_id: req.user.id, product_id, quantity: quantity || 1 }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    try {
        const { data, error } = await req.supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { error } = await req.supabase
            .from('cart_items')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
