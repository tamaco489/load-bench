PROJECT ?= local
include hosts/$(PROJECT).env
export

.PHONY: k6-build k6-smoke k6-load k6-stress stack-up stack-down

k6-build: ## k6 カスタムイメージをビルドする (xk6-output-influxdb 拡張を組み込む)
	docker compose build k6

stack-up: ## InfluxDB・Grafana を起動する
	docker compose up -d influxdb grafana

stack-down: ## InfluxDB・Grafana を停止する
	docker compose down influxdb grafana

k6-smoke: ## スモークテストを実行する (1VU / 1分) - example: make k6-smoke PROJECT=prd
	docker compose run --rm k6 run \
		--out xk6-influxdb=http://influxdb:8086 \
		--env BASE_URL=$(BASE_URL) \
		--env ARTICLE_ID=$(ARTICLE_ID) \
		/k6/scenarios/sample/smoke.js

k6-load: ## 通常負荷テストを実行する (最大20VU / 5分) - example: make k6-load PROJECT=prd
	docker compose run --rm k6 run \
		--out xk6-influxdb=http://influxdb:8086 \
		--env BASE_URL=$(BASE_URL) \
		--env ARTICLE_ID=$(ARTICLE_ID) \
		/k6/scenarios/sample/load.js

k6-stress: ## ストレステストを実行する (最大200VU / 16分) - example: make k6-stress PROJECT=prd
	docker compose run --rm k6 run \
		--out xk6-influxdb=http://influxdb:8086 \
		--env BASE_URL=$(BASE_URL) \
		--env ARTICLE_ID=$(ARTICLE_ID) \
		/k6/scenarios/sample/stress.js

.PHONY: help
help: ## ヘルプを表示する
	@grep -hE '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
