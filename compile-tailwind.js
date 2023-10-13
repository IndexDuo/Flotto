// compile-tailwind.mjs
import { exec } from 'child_process';

const command = 'npx update-browserslist-db@latest';

const child = exec(command);

child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
