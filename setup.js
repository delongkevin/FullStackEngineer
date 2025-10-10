const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 Setting up your portfolio website...');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.log('❌ package.json not found. Please run this script in your project root.');
  process.exit(1);
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.log('❌ Failed to install dependencies');
  process.exit(1);
}

// Create necessary directories
const directories = [
  'components',
  'data', 
  'public/images',
  'public/images/projects',
  'public/icons'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

console.log('✅ Setup complete!');
console.log('🎉 Run "npm run dev" to start your development server');
console.log('🌐 Your site will be available at: http://localhost:3000');