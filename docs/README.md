# Design Plan

> Japanese version: [README.ja.md](README.ja.md)

## Overview

A load-testing platform using **k6** that can run the same test
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
├── results/                    # Raw results (git-ignored)
│   └── k6/
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

k6-smoke:
  docker compose run --rm k6 run --env BASE_URL=$(BASE_URL) /k6/scenarios/smoke.js

k6-load:
  docker compose run --rm k6 run --env BASE_URL=$(BASE_URL) /k6/scenarios/load.js

k6-stress:
  docker compose run --rm k6 run --env BASE_URL=$(BASE_URL) /k6/scenarios/stress.js
```

### Usage

```bash
# Default: local
make k6-load

# project-a
make k6-smoke PROJECT=project-a
make k6-stress PROJECT=project-a
```

## Security

- Add `hosts/*.env` to `.gitignore` — never commit production URLs or credentials.
- Commit `hosts/*.env.example` as a safe reference template.
