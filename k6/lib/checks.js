import { check } from "k6";

/**
 * 記事取得レスポンスの共通チェックを実行する。
 *
 * @param {import("k6/http").RefinedResponse} res - k6 HTTP レスポンスオブジェクト
 * @returns {void}
 */
export function checkArticleResponse(res) {
  check(res, {
    "status is 200": (r) => r.status === 200,
    "has title": (r) => r.json("title") !== undefined,
  });
}
