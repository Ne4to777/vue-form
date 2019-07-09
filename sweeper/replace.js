const fs = require('fs');
const filePath = 'node_modules/@vue/cli-service/lib/config/app.js';
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) console.log(err);
  fs.writeFile(filePath, data.replace(/\.html/g, '.xhtml'), 'utf8', err => {
    if (err) console.log(err);
  });
});
