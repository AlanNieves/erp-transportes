import * as bcrypt from 'bcrypt';

async function run() {
  const hash = await bcrypt.hash('Admin123456', 10);
  console.log(hash);
}

run();
