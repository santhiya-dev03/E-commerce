const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function createAccount() {
    const { data, error } = await supabase.auth.signUp({
        email: 'santhiyamohandvk@gmail.com',
        password: 'santhiya@1',
        options: {
            data: {
                full_name: 'Santhiya'
            }
        }
    });

    if (error) {
        console.error('Error creating account:', error.message);
    } else {
        console.log('Account created successfully:', data.user.email);
        console.log('Please check your email for verification (if enabled) or you can now try logging in.');
    }
}

createAccount();
