const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');
fs.writeFileSync('src/app/page.tsx', content.replace(/\\"/g, '"'));
