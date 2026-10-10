---
sidebar_position: 9
sidebar_label: Container benchmarks
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Container benchmarks

These tests measure Prism's container adapters through the same Prism registration and resolution APIs, using the same service graph and each adapter's default configuration. They compare startup work, repeated resolution and managed allocations.

Lower latency and fewer allocated bytes are better for the measured operation. The results describe this managed-runtime test suite; they are not application-startup timings, UI responsiveness measurements or NativeAOT qualification.

## What each test measures

| Test | Work included |
| --- | --- |
| Registration | Construct the adapter and register five services with their lifetimes. Disposal is outside timing. |
| First resolve | Resolve the root graph for the first time in a newly registered container. Includes deferred provider construction or graph compilation; registration and disposal are outside timing. |
| Transient | Resolve one new leaf service after warming the path. |
| Nested graph | Resolve seven transient objects and reuse one singleton after warming the path. |
| Singleton | Resolve an already created singleton. |
| Scoped | Resolve an already created scoped service from a retained scope. |
| Create scope + resolve + dispose | Create a scope, resolve its first scoped service, then dispose the scope and service. |

“First resolve” is cold for that container, not for the entire process. Registration and first resolution should be considered together: adapters can perform their initialization at different stages.

## Results

Latency is the mean **± the confidence-interval half-width** reported by the benchmark harness. The interval uses a 99.9% confidence level. Startup timings use **microseconds (µs)**; warm operations use **nanoseconds (ns)**. Allocation values are **bytes per operation**, rounded to whole bytes.

<Tabs groupId="container-benchmark-results">
<TabItem value="startup" label="Startup">

### Startup latency (µs)

| Adapter | Registration | First resolve |
| --- | ---: | ---: |
| DryIoc | 6.48 ± 1.78 | 299.64 ± 35.03 |
| Microsoft | 1.25 ± 0.15 | 238.47 ± 30.66 |
| Unity | 30.38 ± 6.16 | 343.79 ± 53.65 |
| Grace | 519.56 ± 71.63 | 398.76 ± 12.01 |
| Castle Windsor | 310.92 ± 13.84 | 20.43 ± 1.80 |

### Startup allocation (bytes / operation)

| Adapter | Registration | First resolve |
| --- | ---: | ---: |
| DryIoc | 4,040 | 6,008 |
| Microsoft | 1,416 | 17,320 |
| Unity | 25,808 | 37,576 |
| Grace | 30,504 | 21,448 |
| Castle Windsor | 168,184 | 12,984 |

Microsoft has the lowest registration mean in this result set. Castle Windsor has the lowest first-resolution mean, but also performs substantially more work during registration. Neither column on its own describes the complete composition cost.

</TabItem>
<TabItem value="warm" label="Warm resolution">

### Warm latency (ns)

| Adapter | Transient | Nested graph | Singleton | Scoped |
| --- | ---: | ---: | ---: | ---: |
| DryIoc | 213.63 ± 9.00 | 1,591.28 ± 60.10 | 183.98 ± 14.14 | 257.33 ± 19.47 |
| Microsoft | 24.49 ± 0.91 | 56.38 ± 1.01 | 20.92 ± 1.24 | 60.69 ± 3.19 |
| Unity | 94.65 ± 2.98 | 881.13 ± 44.21 | 86.12 ± 1.85 | 92.87 ± 4.34 |
| Grace | 9.62 ± 0.38 | 37.72 ± 2.14 | 6.58 ± 0.15 | 155.59 ± 5.71 |
| Castle Windsor | 677.56 ± 30.44 | 5,895.71 ± 135.55 | 466.32 ± 14.18 | 533.59 ± 17.26 |

### Warm allocation (bytes / operation)

| Adapter | Transient | Nested graph | Singleton | Scoped |
| --- | ---: | ---: | ---: | ---: |
| DryIoc | 440 | 1,320 | 416 | 544 |
| Microsoft | 56 | 232 | 32 | 32 |
| Unity | 136 | 1,432 | 112 | 112 |
| Grace | 24 | 200 | 0 | 272 |
| Castle Windsor | 1,712 | 9,848 | 1,240 | 1,344 |

Grace has the lowest transient, nested-graph and singleton means in this graph. Microsoft has the lowest retained-scope resolution mean. The allocation measurements include the adapter's timed resolution path, not only the returned service object.

</TabItem>
<TabItem value="scope" label="Scope lifecycle">

### Create scope + resolve + dispose

| Adapter | Latency (ns) | Allocation (bytes / operation) |
| --- | ---: | ---: |
| DryIoc | 687.17 ± 19.35 | 1,832 |
| Microsoft | 472.52 ± 16.95 | 1,320 |
| Unity | 2,161.56 ± 82.63 | 5,592 |
| Grace | 11,215.91 ± 921.80 | 22,248 |
| Castle Windsor | 17,918.58 ± 860.16 | 14,169 |

Microsoft has the lowest mean and allocation in this scope-lifecycle case. This test includes disposal, unlike the retained-scope resolution test, so the two answer different questions.

</TabItem>
</Tabs>

## Read the comparison fairly

The suite validates transient/singleton/scoped identity, scope isolation and exactly-once disposal before timing. All five adapters passed those graph checks. Small feature probes also passed for named services, factories, collections, lazy creation and independent child scopes; those probes do not cover every possible combination or native-engine feature.

These are one measured baseline, not a universal ranking. Short startup iterations and noisy/multimodal distributions limit precision; the confidence intervals do not capture every source of between-run variation. Real applications have different graphs, lifetimes, concurrency and platform costs. Choose an adapter for its supported capabilities and application behavior, then measure the graph that matters to you.

[Benchmark suite and recorded results](https://github.com/PrismLibrary/Prism.Containers/tree/master/benchmarks) (authorized repository access required). For the supported NativeAOT path, see the separate [NativeAOT guide](native-aot.md).
