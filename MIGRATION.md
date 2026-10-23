# 移行手順

## 1. 現行データの確定
1. Googleスプレッドシートの「ファイル → ダウンロード → カンマ区切り形式（.csv）」で、最新の回答シートを保存します。
2. 回答シートに分類列が追加されている場合、回答列だけでなく分類結果列も保持してください。
3. このフォルダのCSVは既存作業フォルダにあったエクスポートです。最新シートの回答数と比較し、古い場合は新CSVに差し替えます。

## 2. Supabaseプロジェクト
1. Supabaseでプロジェクトを作成。
2. SQL Editorで `supabase/schema.sql` を実行。
3. `service_role` キーは公開リポジトリ・ブラウザへ絶対に入れない。

## 3. 履歴データの取り込み
CSVをJSONへ変換する場合：
```bash
python tools/import_csv.py historical_responses_google_forms.csv -o historical_responses_import.json
```
そのJSONの各行は、`survey_responses` の `source='google_forms_import'`、`source_timestamp`、`raw_row` に格納する設計です。大量行の一括投入はSupabaseのSQL EditorにJSONを直接貼るのではなく、ローカルの管理スクリプトまたは一時的なサーバー側処理を使い、重複防止キー（タイムスタンプ＋元行ハッシュ等）を設けてください。サービスキーをGitHubへコミットしないでください。

## 4. GitHub Pages
1. このフォルダの内容をGitHubリポジトリへアップロード。
2. Settings → Pagesでブランチとルートフォルダを指定。
3. PagesのURLはフロントエンドの配信先にすぎません。保存・分類処理はSupabase側の安全なAPI/Edge Functionに実装します。

## 5. 移行完了前に必要な実装・検証
- Google Formから得ている `SURVEY_DEF`（設問文、選択肢、必須条件、設問番号）を固定JSONとしてエクスポートする。
- Q9分岐時に非該当の後続設問を未回答のまま送信できるよう、フロントとサーバーの必須チェックを一致させる。
- GASの分類ロジック（標準化、重心距離、PC1/PC2計算）をサーバー側へ移植し、既存の分類済みCSVと複数のテスト回答で同一結果になることを照合する。
- 過去回答の回答列をQ番号にマッピングし、分類可能な回答だけ再判定する。欠損行は無理に分類せず `classification_status` に理由を保存する。
- 新旧データの重複を確認し、過去回答と新規回答が同じテーブルで集計されることを確認する。

**注意:** 現在のGAS版は `google.script.run` とGoogleフォーム連携に依存しています。GitHub Pagesに `Index.html` をコピーするだけでは動きません。このパッケージは、履歴CSVとDBスキーマを用意した移行ベースであり、Supabase/GitHubへのログイン・実デプロイ・GAS分類処理の完全移植までは自動実行していません。
