import http from "k6/http";
import { sleep } from "k6";
import { stressThresholds } from "../../config/thresholds.js";
import { stressStages } from "../../config/scenarios.js";
import { BASE_URL, ARTICLE_ID } from "../../config/env.js";
import { checkArticleResponse } from "../../lib/checks.js";

/**
 * ストレステストのオプション。
 * 最大 200 VU まで段階的に増加し、16 分間の高負荷をかける。
 *
 * @type {import("k6/options").Options}
 */
export const options = {
  stages: stressStages,
  thresholds: stressThresholds,
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
