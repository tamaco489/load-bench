# Design Plan

> Japanese version: [README.ja.md](README.ja.md)

## Overview

A load-testing platform using **k6** that can run the same test
scenarios against multiple project hosts by switching a single environment variable.

## Directory Structure

```text
load-bench/
├── docker/
│   └── k6/
│       └── Dockerfile.k6       # Custom k6 image with xk6-output-influxdb
│
├── hosts/                      # Per-project host configs
│   ├── local.env               # BASE_URL=http://localhost:8080/...
│   └── prd.env                 # BASE_URL=https://api.example.com/...
│
├── k6/                         # JavaScript-based load testing
│   ├── scenarios/
│   │   └── sample/
│   │       ├── smoke.js        # Smoke test (1 VU / 1 min)
│   │       ├── load.js         # Load test (max 20 VU / 5 min)
│   │       └── stress.js       # Stress test (max 200 VU / 16 min)
│   ├── lib/
│   │   └── checks.js           # Shared response check helpers
│   └── config/
│       ├── env.js              # Environment variable loader
│       ├── scenarios.js        # Scenario stage definitions
│       └── thresholds.js       # Threshold definitions
│
├── results/k6/                 # Raw results (git-ignored)
├── reports/                    # Generated reports and graphs
├── docker-compose.yml          # k6 + InfluxDB v2 + Grafana
└── Makefile                    # Unified command interface
```

## Getting Started

### 1. Build the k6 custom image

Build a custom k6 binary with the `xk6-output-influxdb` extension.

```bash
make k6-build
```

### 2. Start the monitoring stack

Start InfluxDB and Grafana in the background.

```bash
make stack-up
```

| Service  | URL                      | Credentials    |
| -------- | ------------------------ | -------------- |
| InfluxDB | <http://localhost:18086> | admin/password |
| Grafana  | <http://localhost:13000> | admin/admin    |

### 3. Run tests

```bash
make k6-smoke  PROJECT=prd
make k6-load   PROJECT=prd
make k6-stress PROJECT=prd
```

### 4. Stop the monitoring stack

```bash
make stack-down
```

## Host Management

Hosts (BASE_URL) are managed per project as `.env` files under `hosts/`.
Test scripts never hardcode a host — they reference environment variables instead.

### Format: `hosts/<project>.env`

```env
BASE_URL=https://api.example.com/v1
ARTICLE_ID=article-xxxxxxxxxxxx
```

Commit `hosts/*.env.example` as a template; add `hosts/*.env` to `.gitignore`.

## Makefile Interface

```makefile
PROJECT ?= local
include hosts/$(PROJECT).env
export

k6-build:
  docker compose build k6

stack-up:
  docker compose up -d influxdb grafana

stack-down:
  docker compose down influxdb grafana

k6-smoke:
  docker compose run --rm k6 run \
    --env BASE_URL=$(BASE_URL) \
    --env ARTICLE_ID=$(ARTICLE_ID) \
    /k6/scenarios/sample/smoke.js
```

## Security

- Add `hosts/*.env` to `.gitignore` — never commit production URLs or credentials.
- Commit `hosts/*.env.example` as a safe reference template.
