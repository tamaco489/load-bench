import http from "k6/http";
import { sleep } from "k6";
import { smokeThresholds } from "../../config/thresholds.js";
import { smokeScenario } from "../../config/scenarios.js";
import { BASE_URL, ARTICLE_ID } from "../../config/env.js";
import { checkArticleResponse } from "../../lib/checks.js";

/**
 * スモークテストのオプション。
 * 1 VU / 1 分間で最小限の動作確認を行う。
 *
 * @type {import("k6/options").Options}
 */
export const options = {
  ...smokeScenario,
  thresholds: smokeThresholds,
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
