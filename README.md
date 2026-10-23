# ひなた電子図書館 診断アプリ — GitHub Pages + Supabase移行パッケージ

このパッケージは、既存Googleフォーム回答CSVを新DBへ移すためのデータと、GitHub/Supabase構成の初期セットです。**Googleアカウントや既存スプレッドシートへ自動接続するものではありません**。GitHub/Supabaseは利用者側で作成し、接続情報を設定する必要があります。

## 同梱物
- `historical_responses_google_forms.csv`：提供済みのGoogleフォームCSV（全列・全回答を保持）
- `historical_responses_import.json`：同CSVをJSON化したインポート用データ
- `supabase/schema.sql`：回答・診断結果・フィードバック保存用テーブル
- `tools/import_csv.py`：CSVをJSONに変換するツール
- `legacy/`：現在動いているGAS版の原本（参照用。GitHub Pagesでそのまま動くわけではありません）
- `docs/MIGRATION.md`：手順と注意点

## データについて
同梱CSVは、現在の作業フォルダにあった「電子図書館 利用構造分析アンケート.csv 3.zip」から展開したものです。読み込み時点で**185回答・26設問列＋タイムスタンプ（計27列）**を確認しました。これはGoogleスプレッドシートへのライブ接続ではなく、提供済みCSVの移行用コピーです。現在のスプレッドシートにこれより新しい回答がある場合は、最新CSVを再エクスポートして追加取り込みしてください。

## セキュリティ
Supabaseの `service_role` キーをGitHubやブラウザ側コードに絶対に置かないでください。ブラウザには `anon` キーのみを使用し、RLSを有効にします。公開アンケートの書き込み権限は要件を確認してから最小権限で設定します。

## 現状の制約
既存GASはGoogleフォームの設問定義を実行時に取得し、独自の分類/PCAモデルで判定しています。GitHub Pagesでは `google.script.run` が動作しないため、単純にHTMLを置くだけでは移行完了になりません。GASの設問定義を固定JSON化し、分類/PCA処理をSupabase Edge Function等へ移植・照合する工程が必要です。原本は `legacy/` に保管しています。既存の回答データを取り込む準備はできていますが、GitHub/Supabaseへの実デプロイや、元スプレッドシートとの同期はこのZIP作成だけでは実行されていません。
