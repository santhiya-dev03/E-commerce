const createOrder = async (req, res) => {
    const supabase = req.supabase;
    const userId = req.user.id;

    try {
        // 1. Get cart items
        const { data: cartItems, error: cartError } = await supabase
            .from('cart_items')
            .select('*, products(*)')
            .eq('user_id', userId);

        if (cartError || !cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // 2. Calculate total amount
        const totalAmount = cartItems.reduce((total, item) => {
            return total + (item.products.price * item.quantity);
        }, 0);

        // 3. Create Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{ user_id: userId, total_amount: totalAmount, status: 'completed' }])
            .select()
            .single();

        if (orderError) throw orderError;

        // 4. Create Order Items and Update Stock
        for (const item of cartItems) {
            // Create order item
            await supabase.from('order_items').insert([{
                order_id: order.id,
                product_id: item.product_id,
                price: item.products.price,
                quantity: item.quantity
            }]);

            // Reduce stock
            await supabase.from('products')
                .update({ stock_quantity: item.products.stock_quantity - item.quantity })
                .eq('id', item.product_id);
        }

        // 5. Clear Cart
        await supabase.from('cart_items').delete().eq('user_id', userId);

        res.status(201).json({ message: 'Order placed successfully', order_id: order.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const { data: orders, error } = await req.supabase
            .from('orders')
            .select('*, order_items(*, products(*))')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createOrder, getMyOrders };
