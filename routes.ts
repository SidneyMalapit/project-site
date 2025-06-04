import fs from 'fs';

const routes: string[] = [];

fs.readdirSync('views').forEach((file) => {
  if (file.startsWith('.')) { return; }
  if (fs.lstatSync(`views/${file}`).isDirectory()) { return; }
  routes.push(file.split('.')[0]);
});

export default routes;
