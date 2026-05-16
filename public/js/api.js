const API = {
    async get(endpoint) {
        const res = await fetch(`/api${endpoint}`, {
            credentials: 'include'
        });
        return await res.json();
    },

    async post(endpoint, data) {
        const res = await fetch(`/api${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        return await res.json();
    },

    async put(endpoint, data) {
        const res = await fetch(`/api${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        return await res.json();
    },

    async delete(endpoint) {
        const res = await fetch(`/api${endpoint}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        return await res.json();
    }
};
