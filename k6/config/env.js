/**
 * 環境変数の読み込みを一元管理するモジュール。
 * シナリオ内で直接 __ENV を参照せず、このモジュールの定数を使用する。
 */

/** @type {string} テスト対象のベース URL */
export const BASE_URL = __ENV.BASE_URL;

/** @type {string} テスト対象の記事 ID */
export const ARTICLE_ID = __ENV.ARTICLE_ID;
