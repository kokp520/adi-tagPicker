#!/usr/bin/env node

const { run } = require('../src/index.js');

// run().catch(console.error);

run().catch(err => {
    console.error("error:", err);
    process.exit(1);
})