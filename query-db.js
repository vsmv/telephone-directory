const { Client } = require('pg');

// URL-encode the password: %% becomes %25%25, @ becomes %40
const client = new Client({
    connectionString: 'postgresql://postgres.pcrukmbtjyuuzwszsdsl:%25%25WkHaUPu%40Q2@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
});

async function queryDatabase() {
    try {
        await client.connect();
        console.log('✅ Connected to Supabase database');

        // Query user_credentials
        const result = await client.query('SELECT * FROM public.user_credentials');
        console.log('\n📋 user_credentials table:');
        console.log('Rows:', result.rowCount);
        console.table(result.rows);

        await client.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

queryDatabase();
