import { spawn } from 'node:child_process';

const port = process.env.PORT || '4173';

const child = spawn('npx', ['serve', '-s', 'dist', '-l', port], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});