/**
 * スモークテスト用のシナリオ設定。
 * 1 VU で 1 分間実行し、最小限の動作確認を行う。
 *
 * @type {{ vus: number, duration: string }}
 */
export const smokeScenario = {
  vus: 1,
  duration: "1m",
};

/**
 * 通常負荷テスト用のステージ定義。
 * 最大 20 VU まで段階的に増加し、5 分間の負荷をかける。
 *
 * @type {Array<{ duration: string, target: number }>}
 */
export const loadStages = [
  { duration: "1m", target: 20 },
  { duration: "3m", target: 20 },
  { duration: "1m", target: 0 },
];

/**
 * ストレステスト用のステージ定義。
 * 最大 200 VU まで段階的に増加し、16 分間の高負荷をかける。
 *
 * @type {Array<{ duration: string, target: number }>}
 */
export const stressStages = [
  { duration: "2m", target: 100 },
  { duration: "5m", target: 100 },
  { duration: "2m", target: 200 },
  { duration: "5m", target: 200 },
  { duration: "2m", target: 0 },
];
