import fs from 'fs';
import readline from 'readline';
import { exec } from 'child_process';
import { createClient } from '@supabase/supabase-js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const promptUser = (question) => {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
};

function updateEnvFile(updates) {
    let envContent = fs.readFileSync('.env', 'utf8');
    for (const [key, value] of Object.entries(updates)) {
        envContent = envContent.replace(
            new RegExp(`${key}=".*"`, 'g'),
            `${key}="${value}"`
        );
    }
    fs.writeFileSync('.env', envContent);
}

let SUPABASE_URL;
let SUPABASE_ANON_KEY;
let SUPABASE_SERVICE_KEY;

async function startSupabase() {
    console.log('\n🚀 Starting Supabase...');

    // Start Supabase
    await new Promise((resolve, reject) => {
        exec('npx supabase start', (error, stdout, stderr) => {
            if (error) {
                console.error('Failed to start Supabase:', error);
                reject(error);
                return;
            }
            console.log(stdout);
            console.log('✅ Supabase started successfully!');
            resolve();
        });
    });

    // Get Supabase credentials
    const credentials = await new Promise((resolve, reject) => {
        exec('npx supabase status', (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Failed to get Supabase status:', error);
                reject(error);
                return;
            }

            const apiUrlMatch = stdout.match(/API URL: (.*)/);
            const anonKeyMatch = stdout.match(/anon key: (.*)/);
            const serviceKeyMatch = stdout.match(/service_role key: (.*)/);
            const dashboardUrlMatch = stdout.match(/Studio URL: (.*)/);

            if (!apiUrlMatch || !anonKeyMatch || !serviceKeyMatch) {
                console.error('❌ Failed to extract credentials from Supabase status. You will need to manually add them to the .env file.');
                resolve({});
                return;
            }

            if (dashboardUrlMatch) {
                console.log('\n📊 Dashboard URL:', dashboardUrlMatch[1].trim());
            }

            console.log('✅ Supabase credentials added to .env file!');
            resolve({
                url: apiUrlMatch[1].trim(),
                anonKey: anonKeyMatch[1].trim(),
                serviceKey: serviceKeyMatch[1].trim()
            });
        });
    });

    // Set global variables
    SUPABASE_URL = credentials.url;
    SUPABASE_ANON_KEY = credentials.anonKey;
    SUPABASE_SERVICE_KEY = credentials.serviceKey;

    // Update env file
    updateEnvFile({
        'NEXT_PUBLIC_SUPABASE_URL': SUPABASE_URL,
        'NEXT_PUBLIC_SUPABASE_ANON_KEY': SUPABASE_ANON_KEY
    });

    // Run migrations
    console.log('\n📦 Running database migrations...');
    await new Promise((resolve, reject) => {
        exec('npx supabase migration up', (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Failed to run migrations:', error);
                reject(error);
                return;
            }
            console.log(stdout);
            console.log('✅ Migrations completed successfully!');
            resolve();
        });
    });
}

async function createDefaultUser(email, password) {
    const supabase = createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
}

async function disableSignups() {
    console.log('\n🔒 Disabling public signups...');
    const response = await fetch(`${SUPABASE_URL}/v1/projects/default/config/auth`, {
        method: 'PATCH',
        headers: {
            "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ disable_signup: true })
    });

    if (response.ok) {
        console.log('✅ Public signups disabled successfully!');
    } else {
        console.error("❌ Failed to disable signups:", await response.text());
    }
}

async function setup() {
    try {
        const template = fs.readFileSync('.env.template', 'utf8');
        fs.writeFileSync('.env', template);

        // Get user input
        const blogTitle = (await promptUser('Enter your blog title: ')).trim() || 'Your Blog';
        const blogDescription = (await promptUser('Enter your blog description: ')).trim() || 'A blog about things, etc.';
        const authorName = (await promptUser('Enter author name: ')).trim() || 'Your Name';

        // Update .env with user input
        updateEnvFile({
            'NEXT_PUBLIC_BLOG_TITLE': blogTitle,
            'NEXT_PUBLIC_BLOG_DESCRIPTION': blogDescription,
            'NEXT_PUBLIC_BLOG_AUTHOR': authorName
        });

        await startSupabase();

        // Prompt for default user creation
        const createUser = (await promptUser('\nWould you like to create a default supabase admin user? (y/n): ')).toLowerCase() === 'y';

        if (createUser) {
            const email = (await promptUser('Enter admin email: ')).trim();
            const userPassword = (await promptUser('Enter password (press Enter to generate one): ')).trim();

            // Use provided password or generate a random one
            const password = userPassword || Math.random().toString(36).slice(-12);

            await createDefaultUser(email, password);
            console.log('\n✅ Default admin user created successfully!');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);

            await disableSignups();
        }

        console.log('\n✅ Setup completed successfully!');
    } catch (error) {
        console.error('Error during setup:', error);
    } finally {
        rl.close();
    }
}

setup();
