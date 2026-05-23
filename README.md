# load-bench

k6 と vegeta を使った負荷テスト基盤。プロジェクト別にホストを切り替えて同じシナリオを実行できる。

## ドキュメント

| ドキュメント                         | 説明                                                     |
| ------------------------------------ | -------------------------------------------------------- |
| [設計計画書 (ja)](docs/README.ja.md) | ディレクトリ構成・ホスト管理・Makefile の設計方針        |
| [Design Plan (en)](docs/README.md)   | Directory structure, host management, Makefile interface |

## クイックスタート

```bash
# ローカル向け (デフォルト)
make k6-load

# プロジェクト指定
make k6-load PROJECT=project-a
make vegeta-attack PROJECT=project-b
```
