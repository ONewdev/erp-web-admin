/**
 * build.mjs — Cross-platform production build script
 * Works on Mac, Linux, and Windows
 */
import { execSync } from 'child_process';
import { cpSync, copyFileSync, rmSync, existsSync } from 'fs';

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

try {
  // 1. Next.js build
  console.log('🔨 Building Next.js...');
  run('next build');

  // 2. Copy .htaccess
  console.log('\n📦 Copying .htaccess...');

  if (existsSync('.htaccess')) {
    copyFileSync('.htaccess', 'out/.htaccess');
  } else {
    console.log('   ⚠️ .htaccess not found, skipping.');
  }

  // 3. Copy backend folder
  console.log('📦 Copying backend...');
  
  const excludeItems = [
    '.docker',
    'Db',
    'docker-compose.yml',
    'Dockerfile',
    'database.sql',
    '.dockerignore'
  ];

  cpSync('backend', 'out/backend', { 
    recursive: true,
    filter: (src) => {
      const pathSegments = src.split(/[/\\]/);
      const isExcluded = excludeItems.some(excluded => pathSegments.includes(excluded));
      return !isExcluded;
    }
  });

  // 4. Set production env
  console.log('🔧 Setting backend to production env...');
  copyFileSync('backend/.env.production', 'out/backend/.env');

  // 5. Clean up dev env files from output
  try {
    rmSync('out/backend/.env.development', { force: true });
    rmSync('out/backend/.env.production', { force: true });
  } catch (err) {
    // Ignore if not exist
  }

  console.log('\n✅ Build complete! Output in ./out');
} catch (err) {
  console.error('\n❌ Build failed:', err.message);
  process.exit(1);
}
