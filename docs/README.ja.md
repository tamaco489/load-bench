# 設計計画書

> English version: [README.md](README.md)

## 概要

**k6** を使った負荷テスト基盤。ホスト設定をプロジェクト別に分離することで、同じシナリオを複数のプロジェクトに対して切り替えて実行できる構成とする。

## ディレクトリ構成

```text
load-bench/
├── docker/
│   └── k6/
│       └── Dockerfile.k6       # xk6-output-influxdb 組み込みのカスタム k6 イメージ
│
├── hosts/                      # プロジェクト別ホスト設定
│   ├── local.env               # BASE_URL=http://localhost:8080/...
│   └── prd.env                 # BASE_URL=https://api.example.com/...
│
├── k6/                         # JS ベースの負荷テスト
│   ├── scenarios/
│   │   └── sample/
│   │       ├── smoke.js        # スモークテスト (1 VU / 1 分)
│   │       ├── load.js         # 通常負荷テスト (最大 20 VU / 5 分)
│   │       └── stress.js       # ストレステスト (最大 200 VU / 16 分)
│   ├── lib/
│   │   └── checks.js           # レスポンス共通チェックヘルパー
│   └── config/
│       ├── env.js              # 環境変数の一元管理
│       ├── scenarios.js        # シナリオステージ定義
│       └── thresholds.js       # 閾値定義
│
├── results/k6/                 # 実行結果の生データ (git ignore 対象)
├── reports/                    # 生成済みレポート・グラフ
├── docker-compose.yml          # k6 + InfluxDB v2 + Grafana
└── Makefile                    # 実行コマンドの統一インターフェース
```

## セットアップ手順

### 1. k6 カスタムイメージをビルドする

`xk6-output-influxdb` 拡張を組み込んだカスタム k6 バイナリをビルドする。

```bash
make k6-build
```

### 2. 監視スタックを起動する

InfluxDB と Grafana をバックグラウンドで起動する。

```bash
make stack-up
```

| サービス | URL                      | 認証情報       |
| -------- | ------------------------ | -------------- |
| InfluxDB | <http://localhost:18086> | admin/password |
| Grafana  | <http://localhost:13000> | admin/admin    |

### 3. テストを実行する

```bash
make k6-smoke  PROJECT=prd
make k6-load   PROJECT=prd
make k6-stress PROJECT=prd
```

### 4. 監視スタックを停止する

```bash
make stack-down
```

## ホスト管理方針

ホスト (BASE_URL) はプロジェクト別に `hosts/` ディレクトリの `.env` ファイルで管理する。
テストスクリプトはホストを直接持たず、環境変数を参照する。

### `hosts/<project>.env` の形式

```env
BASE_URL=https://api.example.com/v1
ARTICLE_ID=article-xxxxxxxxxxxx
```

`hosts/*.env.example` をサンプルとしてコミットし、`hosts/*.env` は `.gitignore` に追加して秘匿する。

## Makefile インターフェース

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

## セキュリティ

- `hosts/*.env` は `.gitignore` に追加し、本番 URL・認証情報をコミットしない
- `hosts/*.env.example` をコミット対象とし、サンプル値のみ記載する
