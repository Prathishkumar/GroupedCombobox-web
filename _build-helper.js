const { execSync } = require('child_process');
try {
    execSync('npx pluggable-widgets-tools build:web', { encoding: 'utf8', timeout: 120000, stdio: ['pipe', 'pipe', 'pipe'] });
    console.log('BUILD SUCCESS');
} catch (e) {
    const stderr = e.stderr || '';
    const stdout = e.stdout || '';
    // Write full output
    require('fs').writeFileSync('full-build-error.log', 'STDOUT:\n' + stdout + '\n\nSTDERR:\n' + stderr, 'utf8');
    // Print key error lines
    const allLines = (stdout + '\n' + stderr).split('\n');
    allLines.forEach((line, i) => {
        if (line.includes('TS') || line.includes('Error') || line.includes('error') || line.includes('Cannot')) {
            process.stdout.write('ERR> ' + line + '\n');
        }
    });
}
