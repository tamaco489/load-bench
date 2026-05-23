# Design Plan

> Japanese version: [README.ja.md](README.ja.md)

## Overview

A load-testing platform using **k6** and **vegeta** that can run the same test
scenarios against multiple project hosts by switching a single environment variable.

## Directory Structure

```text
load-bench/
├── hosts/                      # Per-project host configs
│   ├── local.env               # BASE_URL=http://localhost:8080
│   ├── project-a.env           # BASE_URL=https://api.project-a.com
│   └── project-b.env           # BASE_URL=https://api.project-b.com
│
├── k6/                         # JavaScript-based load testing
│   ├── scenarios/
│   │   ├── smoke.js            # Smoke test (minimal validation)
│   │   ├── load.js             # Standard load test
│   │   └── stress.js           # Stress test
│   ├── lib/                    # Shared utilities / helpers
│   └── config/                 # Thresholds and options
│
├── vegeta/                     # High-precision rate-based testing
│   ├── targets/
│   │   └── api.tmpl            # URL template; expanded via envsubst
│   └── config/                 # Rate and duration settings
│
├── results/                    # Raw results (git-ignored)
│   ├── k6/
│   └── vegeta/
│
├── reports/                    # Generated reports and graphs
│
└── Makefile                    # Unified command interface
```

## Host Management

Hosts (BASE_URL) are managed per project as `.env` files under `hosts/`.
Test scripts never hardcode a host — they reference the `BASE_URL` environment
variable instead.

### Format: `hosts/<project>.env`

```env
BASE_URL=https://api.project-a.com
```

Additional variables (e.g. auth tokens) can also be defined:

```env
BASE_URL=https://api.project-a.com
API_KEY=your-api-key
```

Commit `hosts/*.env.example` as a template; add `hosts/*.env` to `.gitignore`.

## Makefile Interface

```makefile
PROJECT ?= local
include hosts/$(PROJECT).env
export

k6-load:
 k6 run --env BASE_URL=$(BASE_URL) k6/scenarios/load.js

vegeta-attack:
 envsubst < vegeta/targets/api.tmpl | \
 vegeta attack -rate=50 -duration=30s | \
 vegeta report
```

### Usage

```bash
# Default: local
make k6-load

# project-a
make k6-load PROJECT=project-a

# project-b
make vegeta-attack PROJECT=project-b
```

## Tool Comparison

| Tool   | Characteristics                               | Primary Use                              |
| ------ | --------------------------------------------- | ---------------------------------------- |
| k6     | JavaScript-based, flexible scenario authoring | Complex scenarios, ramping load tests    |
| vegeta | Go-based, precise rate control                | Constant-rate attacks, throughput checks |

## Security

- Add `hosts/*.env` to `.gitignore` — never commit production URLs or credentials.
- Commit `hosts/*.env.example` as a safe reference template.
