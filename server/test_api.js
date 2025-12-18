import fetch from 'node-fetch'; // Fallback if no global fetch, but usually global in node 18+
// In case node-fetch is not installed, we'll try to use global fetch. 
// If that fails, we might need another approach, but let's try standard fetch first.

async function test() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@healthstore.com', password: 'admin123' })
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) {
            console.error('Login failed:', loginData);
            return;
        }

        const token = loginData.token;
        console.log('Login successful. Token obtained.');

        // 2. Get Users
        console.log('Fetching users...');
        const userRes = await fetch('http://localhost:3001/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const userData = await userRes.json(); // If 500, this will likely contain the error message

        console.log('Status:', userRes.status);
        console.log('Response:', JSON.stringify(userData, null, 2));

    } catch (e) {
        console.error('Script error:', e);
    }
}

test();
