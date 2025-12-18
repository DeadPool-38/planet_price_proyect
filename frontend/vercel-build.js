const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Starting Vercel build process...');
console.log('📂 Current working directory:', process.cwd());

// Log environment variables (excluding sensitive ones)
console.log('\n🌐 Environment:');
Object.entries(process.env)
  .filter(([key]) => !key.toLowerCase().includes('secret') && !key.toLowerCase().includes('key') && !key.toLowerCase().includes('token'))
  .forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });

try {
  // Install dependencies
  console.log('\n📦 Installing dependencies...');
  execSync('npm install --loglevel verbose', { stdio: 'inherit' });
  
  // Check node_modules
  console.log('\n🔍 Verifying node_modules...');
  if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules exists');
  } else {
    throw new Error('❌ node_modules not found after installation!');
  }
  
  // Run build
  console.log('\n🏗️  Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Verify build output
  const buildDir = path.join(process.cwd(), 'build');
  console.log('\n🔍 Verifying build output...');
  
  if (!fs.existsSync(buildDir)) {
    throw new Error('❌ Build directory not found!');
  }
  
  const requiredFiles = ['index.html', 'static/js', 'static/css'];
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(buildDir, file)));
  
  if (missingFiles.length > 0) {
    throw new Error(`❌ Missing required build files: ${missingFiles.join(', ')}`);
  }
  
  console.log('✅ Build verification passed!');
  
  // List all built files for debugging
  const listFiles = (dir, prefix = '') => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        console.log(`📂 ${prefix}${file}/`);
        listFiles(fullPath, `${prefix}${file}/`);
      } else {
        console.log(`📄 ${prefix}${file} (${(stat.size / 1024).toFixed(2)} KB)`);
      }
    });
  };
  
  console.log('\n📋 Build output structure:');
  listFiles(buildDir);
  
  // Check for common issues
  console.log('\n🔍 Checking for common issues...');
  
  // Check if index.html has the correct root div
  const indexHtml = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf-8');
  if (!indexHtml.includes('<div id="root">')) {
    console.warn('⚠️  Warning: index.html might be missing the root div with id="root"');
  }
  
  // Check if static files are being properly referenced
  const jsFiles = fs.readdirSync(path.join(buildDir, 'static/js'));
  const cssFiles = fs.readdirSync(path.join(buildDir, 'static/css'));
  
  console.log(`\n📊 Build summary:`);
  console.log(`- JavaScript files: ${jsFiles.length}`);
  console.log(`- CSS files: ${cssFiles.length}`);
  console.log(`- Total build size: ${getDirectorySize(buildDir) / 1024 / 1024} MB`);
  
  console.log('\n✅ Build completed successfully!');
  process.exit(0);
  
} catch (error) {
  console.error('\n❌ Build failed:');
  console.error(error);
  
  // Try to provide more context about the error
  if (error.message.includes('ENOENT')) {
    console.error('\n🔍 This usually means a file or directory is missing.');
  } else if (error.message.includes('EADDRINUSE')) {
    console.error('\n🔍 Port is already in use. Try stopping other servers.');
  }
  
  process.exit(1);
}

// Helper function to calculate directory size
function getDirectorySize(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  return files.reduce((size, file) => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      return size + getDirectorySize(filePath);
    } else {
      return size + fs.statSync(filePath).size;
    }
  }, 0);
}
