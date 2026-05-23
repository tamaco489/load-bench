import http from "k6/http";
import { sleep } from "k6";
import { loadThresholds } from "../../config/thresholds.js";
import { loadStages } from "../../config/scenarios.js";
import { BASE_URL, ARTICLE_ID } from "../../config/env.js";
import { checkArticleResponse } from "../../lib/checks.js";

/**
 * 通常負荷テストのオプション。
 * 最大 20 VU まで段階的に増加し、5 分間の負荷をかける。
 *
 * @type {import("k6/options").Options}
 */
export const options = {
  stages: loadStages,
  thresholds: loadThresholds,
};

/**
 * 記事取得エンドポイントへリクエストを送信し、レスポンスを検証する。
 *
 * @returns {void}
 */
export default function () {
  const res = http.get(`${BASE_URL}/articles/${ARTICLE_ID}`);
  checkArticleResponse(res);
  sleep(1);
}
