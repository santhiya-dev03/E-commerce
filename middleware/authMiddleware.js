const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const { data: user, error } = await req.supabase
            .from('users')
            .select('id, name, email')
            .eq('id', decoded.id)
            .single();

        if (!user || error) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Not authorized, token failed' });
    }
};

module.exports = { protect };
