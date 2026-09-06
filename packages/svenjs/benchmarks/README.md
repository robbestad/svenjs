# Runtime benchmarks

From the repository root, build and measure the production bundle:

```sh
pnpm bench
```

The command builds the library before running the script, which always imports `dist/svenjs.js`. The defaults run three warmups and ten measured repetitions per case. For a longer run with machine-readable output, build first and invoke the script directly so build logs stay out of the JSON:

```sh
pnpm --filter svenjs build
node packages/svenjs/scripts/benchmark.mjs --warmup=5 --repeats=30 --json > /tmp/svenjs-benchmark.json
```

JSON includes all raw samples, median, nearest-rank p95, minimum, Node/OS/CPU/happy-dom versions, timestamp, runtime version and bundle SHA-256. Human output prints the same metadata and a timing table. Measurements are milliseconds per complete operation, not per node. With ten samples, p95 is the maximum; use more repetitions to examine the distribution.

Each case starts with an independent fixture of 100 or 1,000 list items (each an `li` plus a text node, within one `ul`). Both `h` and cached tagged `html` templates run with keyed and positional unkeyed lists. The scenarios are:

| Scenario | Measured work |
| --- | --- |
| mount | Create component instance and VNodes, then mount the list. |
| same-order | Change all item texts while retaining order. |
| reorder | Reverse the entire list. Keyed items preserve DOM identity; unkeyed items update positional text. These have different identity semantics. |
| insert | Insert 10% new items in the middle. |
| remove | Remove 10% of the original items from the middle. |
| batched | Ten state replacements followed by one synchronous flush. |
| unbatched | Ten state replacements, each immediately flushed. |
| store | Ten store updates observed by one list component, followed by one synchronous flush. This measures one subscriber rendering many items, not subscriber fan-out. |
| ssr | Create the component and VNodes, then serialize the entire list. One case per syntax/size: keys have no reconciliation role in SSR. |

Fixture construction, initial mounting for update cases, input-array transformations, correctness assertions and teardown are excluded from timing. VNode construction and rendering are included. Every trial verifies exact list content, keyed DOM identity for surviving items, and expected render counts. SSR verifies exact markup. Warmups also run these checks; incorrect behavior fails the command. Pending scheduler microtasks drain between trials. The fixed case order and data make runs repeatable, but do not remove JIT, thermal or garbage-collection effects.

This is a synthetic Node/happy-dom benchmark. It measures JavaScript and simulated DOM operations, without browser layout, paint or input latency. Timings include automatic garbage collection if it occurs during the measured interval. Warmup makes `html` primarily a cached-template measurement; this is not a cold-start benchmark. Independent fresh fixtures intentionally exclude long-lived application effects.

For comparisons, keep the machine idle and use the same Node, dependency versions, options and benchmark script for both revisions. Run several processes for each revision and retain the JSON reports. Rebuild each revision before measuring, and check the reported artifact hash. Do not infer a regression or improvement from a single noisy sample, compare different machines as if equivalent, or reconstruct historical measurements.

This command is opt-in and has no timing thresholds in CI. The existing deterministic DOM-operation baseline and bundle-size budget remain the regression gates.
