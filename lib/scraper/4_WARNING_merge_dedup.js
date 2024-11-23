const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Read the deduplicated results
const dedupResults = JSON.parse(fs.readFileSync('results_deduplicated.json', 'utf8'));

console.log('\x1b[33m%s\x1b[0m', 'WARNING: This will overwrite results.json with the deduplicated data!');
console.log(`Deduplicated entries to write: ${dedupResults.length}`);

rl.question('Are you sure you want to proceed? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes') {
        // Write the deduplicated results back to results.json
        fs.writeFileSync('results.json', JSON.stringify(dedupResults, null, 2));
        console.log('\x1b[32m%s\x1b[0m', 'Successfully merged deduplicated results back to results.json');
    } else {
        console.log('\x1b[31m%s\x1b[0m', 'Operation cancelled');
    }
    rl.close();
});
