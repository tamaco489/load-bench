# CLAUDE.md

k6 と vegeta を使った負荷テスト基盤。`PROJECT` 変数でホストを切り替えることで、同一シナリオを複数のプロジェクトに対して実行できる。

## 調査時の制約事項

> [!IMPORTANT]
>
> - **即時性は求めない。時間をかけてでも根拠に基づく正確なアウトプットを行う**
> - 公式ドキュメントや関連資料の調査はメインコンテキストを汚さないよう、
>   別途調査用エージェントに委譲する
> - 根拠が明らかな場合は、該当ドキュメントの URL と引用文
>   (英語の場合は英文・日本語訳の両方) を必ず本文中に明記する
> - 根拠のない内容を断言しない。不確かな場合は「確認できていない」と明示し、
>   取り繕いのための補足説明を生成しない

## 作業時の制約事項

> [!IMPORTANT]
>
> - **負荷テストの実行 (`make k6-*` / `make vegeta-*`) は必ずユーザーの承認を得てから行う。**
>   外部サービスへの意図しない攻撃を防ぐため、Claude が自己判断で実行することを禁止する
> - `hosts/*.env` はコミット禁止。コミット前に対象ファイルを必ず確認する
> - **コミット・push は必ず `/smart-commit` スキル経由で実行するか、実行前にユーザーの承認を得ること。**
>   Claude が自己判断でコミット・push することを禁止する
> - テストスクリプト内でホストをハードコードしない。`BASE_URL` 環境変数のみを参照する

## 構成

- `hosts/` — プロジェクト別ホスト設定 (`*.env` は gitignore 対象、`*.env.example` のみコミット)
- `k6/` — JavaScript ベースの負荷テストシナリオ・共通ヘルパー・設定
- `vegeta/` — Go ベースのレートテスト定義・設定
- `results/` — 実行結果の生データ (gitignore 対象)
- `reports/` — 生成済みレポート・グラフ
- `.claude/rules/github/` — コミット・PR のルール

## 実行可能なスキル

| スキル名       | 用途                                                    | トリガー例                                          |
| -------------- | ------------------------------------------------------- | --------------------------------------------------- |
| `smart-commit` | 差分をグループ化してコミット・push・PR 作成まで行う     | 「コミットして」「変更を push して」「PR 作成して」 |
| `md-linter`    | Markdown ファイルを静的解析し、警告を自動・手動修正する | 「md を lint して」「markdownlint を直して」        |

## コマンド

```bash
# k6 負荷テスト (デフォルト: local)
make k6-load
make k6-load PROJECT=project-a

# k6 スモーク / ストレステスト
make k6-smoke PROJECT=project-a
make k6-stress PROJECT=project-a

# vegeta レートテスト
make vegeta-attack PROJECT=project-b
```

## Makefile の構造

```makefile
PROJECT ?= local
include hosts/$(PROJECT).env
export
```

`PROJECT` 未指定時は `local` が使われる。

## ホスト管理

`hosts/<project>.env` に `BASE_URL` を定義し、Makefile で `include` + `export` して各ツールへ渡す。

- `hosts/local.env` — デフォルト (`http://localhost:8080`)
- `hosts/<project>.env` — プロジェクト別 (`.gitignore` 対象)
- `hosts/<project>.env.example` — コミット用サンプル
