PROJECT ?= local
include hosts/$(PROJECT).env
export

.PHONY: k6-build k6-smoke k6-load k6-stress stack-up stack-down

# k6 カスタムイメージをビルドする (xk6-output-influxdb 拡張を組み込む)
k6-build:
	docker compose build k6

# InfluxDB・Grafana を起動する
stack-up:
	docker compose up -d influxdb grafana

# InfluxDB・Grafana を停止する
stack-down:
	docker compose down influxdb grafana

# スモークテストを実行する (1 VU / 1 分)
k6-smoke:
	docker compose run --rm k6 run \
		--out xk6-influxdb=http://influxdb:8086 \
		--env BASE_URL=$(BASE_URL) \
		--env ARTICLE_ID=$(ARTICLE_ID) \
		/k6/scenarios/sample/smoke.js

# 通常負荷テストを実行する (最大 20 VU / 5 分)
k6-load:
	docker compose run --rm k6 run \
		--out xk6-influxdb=http://influxdb:8086 \
		--env BASE_URL=$(BASE_URL) \
		--env ARTICLE_ID=$(ARTICLE_ID) \
		/k6/scenarios/sample/load.js

# ストレステストを実行する (最大 200 VU / 16 分)
k6-stress:
	docker compose run --rm k6 run \
		--out xk6-influxdb=http://influxdb:8086 \
		--env BASE_URL=$(BASE_URL) \
		--env ARTICLE_ID=$(ARTICLE_ID) \
		/k6/scenarios/sample/stress.js
