#!/usr/bin/env node

import { run } from '../src/index.js';

// run().catch(console.error);

run().catch(err => {
    console.error("error:", err);
    process.exit(1);
})