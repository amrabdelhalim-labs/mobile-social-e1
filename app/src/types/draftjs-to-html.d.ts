/**
 * تعريف أنواع لمكتبة draftjs-to-html
 * ─────────────────────────────────────
 * المكتبة لا تحتوي على أنواع TypeScript رسمية
 */
declare module 'draftjs-to-html' {
	import type { RawDraftContentState } from 'draft-js';

	/**
	 * يُحوّل كائن Draft.js Raw ContentState إلى HTML string
	 */
	export default function draftToHtml(rawContentState: RawDraftContentState): string;
}
