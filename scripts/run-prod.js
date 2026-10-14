// Builds and starts the frontend with the production settings from .env.production,
// even when a .env.local is present (values set here win over .env files).
//
//   npm run prod                   build, then start on port 3000
//   npm run prod -- --port 3100    use another port
//   npm run prod -- --skip-build   start again without rebuilding
//
// It builds into .next-prod, so a running "npm run dev" is not disturbed.
// Port 3000 is the default because the backend only accepts browser requests from the
// address set in its CLIENT_URL (and localhost:3000 for development).
const fs = require('fs');
const path = require('path');
const { spawnSync, spawn } = require('child_process');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const skipBuild = args.includes('--skip-build');
const portIndex = args.indexOf('--port');
const port = portIndex >= 0 ? args[portIndex + 1] : '3000';

// Read .env.production without printing any values
const envFile = path.join(root, '.env.production');
if (!fs.existsSync(envFile)) {
  console.error('Missing client/.env.production');
  process.exit(1);
}
const prodEnv = {};
for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (match) prodEnv[match[1]] = match[2];
}

const env = { ...process.env, ...prodEnv, NODE_ENV: 'production', NEXT_DIST_DIR: '.next-prod', NEXT_TELEMETRY_DISABLED: '1' };
const nextBin = require.resolve('next/dist/bin/next', { paths: [root] });

console.log(`Using API:    ${env.NEXT_PUBLIC_API_URL}`);
console.log(`Using socket: ${env.NEXT_PUBLIC_SOCKET_URL}`);

if (!skipBuild) {
  console.log('\nBuilding...');
  const build = spawnSync(process.execPath, [nextBin, 'build'], { cwd: root, env, stdio: 'inherit' });
  if (build.status !== 0) process.exit(build.status || 1);
}

console.log(`\nStarting on http://localhost:${port}`);
const server = spawn(process.execPath, [nextBin, 'start', '-p', port], { cwd: root, env, stdio: 'inherit' });
server.on('exit', (code) => process.exit(code || 0));
