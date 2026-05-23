/**
 * スモークテスト用の閾値。
 * 最小限の検証を目的とし、厳しめのレイテンシ基準を設定する。
 *
 * @type {import("k6/options").Thresholds}
 */
export const smokeThresholds = {
  http_req_failed: ["rate<0.01"],
  http_req_duration: ["p(95)<500"],
};

/**
 * 通常負荷テスト用の閾値。
 * 実運用を想定した標準的なレイテンシ基準を設定する。
 *
 * @type {import("k6/options").Thresholds}
 */
export const loadThresholds = {
  http_req_failed: ["rate<0.01"],
  http_req_duration: ["p(95)<1000"],
};

/**
 * ストレステスト用の閾値。
 * 高負荷時の限界を測定するため、エラー率・レイテンシを緩めに設定する。
 *
 * @type {import("k6/options").Thresholds}
 */
export const stressThresholds = {
  http_req_failed: ["rate<0.05"],
  http_req_duration: ["p(95)<2000"],
};
