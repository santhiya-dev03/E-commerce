const Auth = {
    users: JSON.parse(localStorage.getItem('serene_users')) || [
        {
            name: 'Santhiya',
            email: 'santhiyamohandvk@gmail.com',
            pass: 'santhiya@1'
        }
    ],

    init() {
        if (!localStorage.getItem('serene_users')) {
            localStorage.setItem('serene_users', JSON.stringify(this.users));
        }
    },

    login(email, pass) {
        const user = this.users.find(u => u.email === email && u.pass === pass);
        if (user) {
            localStorage.setItem('serene_current_user', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid email or password' };
    },

    register(name, email, pass) {
        if (this.users.some(u => u.email === email)) {
            return { success: false, message: 'User already exists' };
        }
        const newUser = { name, email, pass };
        this.users.push(newUser);
        localStorage.setItem('serene_users', JSON.stringify(this.users));
        localStorage.setItem('serene_current_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('serene_current_user'));
    },

    logout() {
        localStorage.removeItem('serene_current_user');
        window.location.href = 'login.html';
    }
};

export default Auth;
