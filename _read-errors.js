const fs = require('fs');
const c = fs.readFileSync('err4.txt', 'utf8');
const lines = c.split('\n');

for (let i = 0; i < lines.length; i++) {
    // Write each line with a number prefix, force newline
    process.stdout.write('L' + String(i).padStart(2, '0') + '|' + lines[i] + '\n');
}
