# 設計計画書

> English version: [README.md](README.md)

## 概要

**k6** と **vegeta** を使った負荷テスト基盤。ホスト設定をプロジェクト別に分離することで、同じシナリオを複数のプロジェクトに対して切り替えて実行できる構成とする。

## ディレクトリ構成

```text
load-bench/
├── hosts/                      # プロジェクト別ホスト設定
│   ├── local.env               # BASE_URL=http://localhost:8080
│   ├── project-a.env           # BASE_URL=https://api.project-a.com
│   └── project-b.env           # BASE_URL=https://api.project-b.com
│
├── k6/                         # JS ベースの負荷テスト
│   ├── scenarios/              # シナリオ別スクリプト
│   │   ├── smoke.js            # スモークテスト (最小検証)
│   │   ├── load.js             # 通常負荷テスト
│   │   └── stress.js           # ストレステスト
│   ├── lib/                    # 共通ユーティリティ・ヘルパー
│   └── config/                 # thresholds・options の設定
│
├── vegeta/                     # Go ベースの高精度レートテスト
│   ├── targets/
│   │   └── api.tmpl            # ${BASE_URL}/path を envsubst で展開
│   └── config/                 # レート・期間の設定
│
├── results/                    # 実行結果 (git ignore 推奨)
│   ├── k6/
│   └── vegeta/
│
├── reports/                    # 生成済みレポート・グラフ
│
└── Makefile                    # 実行コマンドの統一インターフェース
```

## ホスト管理方針

ホスト (BASE_URL) はプロジェクト別に `hosts/` ディレクトリの `.env` ファイルで管理する。
テストスクリプトはホストを直接持たず、環境変数 `BASE_URL` を参照する。

### `hosts/<project>.env` の形式

```env
BASE_URL=https://api.project-a.com
```

認証トークンなど追加の環境変数も定義できる。

```env
BASE_URL=https://api.project-a.com
API_KEY=your-api-key
```

`hosts/*.env.example` をサンプルとしてコミットし、`hosts/*.env` は `.gitignore` に追加して秘匿する。

## Makefile インターフェース

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

### 実行例

```bash
# ローカル向け (デフォルト)
make k6-load

# project-a 向け
make k6-load PROJECT=project-a

# project-b 向け
make vegeta-attack PROJECT=project-b
```

## ツール概要

| ツール | 特性                                  | 主な用途                                 |
| ------ | ------------------------------------- | ---------------------------------------- |
| k6     | JavaScript ベース、シナリオ記述が柔軟 | 複雑なシナリオ・段階的な負荷テスト       |
| vegeta | Go ベース、高精度なレート制御         | 一定レートでの継続攻撃・スループット測定 |

## セキュリティ

- `hosts/*.env` は `.gitignore` に追加し、本番 URL・認証情報をコミットしない
- `hosts/*.env.example` をコミット対象とし、サンプル値のみ記載する
