const fs = require('fs');
const path = require('path');

console.log('Checking .env configuration...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('Creating .env file with default values...\n');
    
    const defaultEnv = `# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/event-management

# Frontend URL
CLIENT_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
`;
    
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ .env file created with PORT=5001');
} else {
    console.log('✅ .env file exists');
    
    // Read and check PORT setting
    const envContent = fs.readFileSync(envPath, 'utf8');
    const portMatch = envContent.match(/PORT=(\d+)/);
    
    if (portMatch) {
        const port = portMatch[1];
        console.log(`📍 Current PORT setting: ${port}`);
        
        if (port !== '5001') {
            console.log('⚠️  PORT is not set to 5001');
            console.log('Updating PORT to 5001...');
            
            const updatedContent = envContent.replace(/PORT=\d+/, 'PORT=5001');
            fs.writeFileSync(envPath, updatedContent);
            console.log('✅ PORT updated to 5001');
        } else {
            console.log('✅ PORT is correctly set to 5001');
        }
    } else {
        console.log('⚠️  PORT not found in .env file');
        console.log('Adding PORT=5001 to .env file...');
        
        const updatedContent = `PORT=5001\n${envContent}`;
        fs.writeFileSync(envPath, updatedContent);
        console.log('✅ PORT=5001 added to .env file');
    }
}

console.log('\n🔧 Configuration check complete!');
console.log('Now run: npm run server');
