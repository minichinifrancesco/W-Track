const { spawn } = require('child_process');
const os = require('os');

function getLanIpAddress() {
  const interfaces = os.networkInterfaces();
  const preferredNames = ['en0', 'en1', 'Wi-Fi', 'Ethernet'];
  const entries = [];

  for (const [name, addresses = []] of Object.entries(interfaces)) {
    for (const address of addresses) {
      if (address.family === 'IPv4' && !address.internal) {
        entries.push({ name, address: address.address });
      }
    }
  }

  const preferred = entries.find((entry) => preferredNames.includes(entry.name));
  return (preferred || entries[0])?.address;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL || (() => {
  const lanIp = getLanIpAddress();
  return lanIp ? `http://${lanIp}:3000` : 'http://localhost:3000';
})();

const args = ['expo', 'start', '--lan', ...process.argv.slice(2)];
const child = spawn('npx', args, {
  env: {
    ...process.env,
    EXPO_PUBLIC_API_URL: apiUrl,
  },
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

console.log(`Expo usera il backend: ${apiUrl}`);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
