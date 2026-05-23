PROJECT ?= local
include hosts/$(PROJECT).env
export

.PHONY: k6-smoke k6-load k6-stress

k6-smoke:
	docker compose run --rm k6 run \
		--env BASE_URL=$(BASE_URL) \
		--env ARTICLE_ID=$(ARTICLE_ID) \
		/k6/scenarios/sample/smoke.js

k6-load:
	docker compose run --rm k6 run \
		--env BASE_URL=$(BASE_URL) \
		--env ARTICLE_ID=$(ARTICLE_ID) \
		/k6/scenarios/sample/load.js

k6-stress:
	docker compose run --rm k6 run \
		--env BASE_URL=$(BASE_URL) \
		--env ARTICLE_ID=$(ARTICLE_ID) \
		/k6/scenarios/sample/stress.js
