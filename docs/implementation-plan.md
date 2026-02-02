# 実装計画 - Phase 1 MVP

## アーキテクチャ概要

```
Nuxt 3 (Vue 3 + TypeScript)
├── pages/           # ページコンポーネント
├── components/      # UIコンポーネント（機能別）
├── composables/     # 再利用可能なロジック
├── layouts/         # ページレイアウト
├── i18n/            # 国際化（日本語のみ）
├── assets/          # CSS, 画像
└── server/
    ├── api/         # APIエンドポイント
    ├── services/    # 外部API連携サービス
    ├── middleware/   # 認証・ガードミドルウェア
    ├── database/    # D1マイグレーション・スキーマ
    └── utils/       # バリデーション・ヘルパー
```

## 実装フェーズ

### Phase 1A: プロジェクト基盤

| Step | 内容 | 依存 |
|------|------|------|
| 1 | Nuxt 3 プロジェクトスキャフォールディング | なし |
| 2 | Tailwind CSS + デザインシステム | Step 1 |
| 3 | i18n 基盤（日本語のみ） | Step 1 |
| 4 | DB スキーマ設計 + D1 マイグレーション | Step 1 |
| 5 | 共通ユーティリティ（Zod バリデーション等） | Step 1 |
| 6 | 共通UIコンポーネント + レイアウト | Steps 2, 3 |

> Steps 2, 3, 4, 5 は Step 1 完了後に並列実行可能

### Phase 1B: 認証システム

| Step | 内容 | 依存 |
|------|------|------|
| 7 | 認証ミドルウェア + セッション管理 | Steps 4, 5 |
| 8 | メール+パスワード認証 | Step 7 |
| 9 | Google OAuth | Step 7 |
| 10 | LINE OAuth | Step 7 |
| 11 | 認証UI（ログイン・登録画面） | Steps 8-10, 6 |

> Steps 8, 9, 10 は並列実行可能

### Phase 1C: コア機能 - プラン生成

| Step | 内容 | 依存 |
|------|------|------|
| 12 | Google Places API サービス | Step 5 |
| 13 | Google Directions API サービス | Step 5 |
| 14 | Claude API プラン生成サービス | Steps 12, 13 |
| 15 | プラン生成 API エンドポイント | Steps 7, 12-14 |
| 16 | セッション・課金ガードミドルウェア | Steps 4, 7 |

> Steps 12, 13 は並列実行可能

### Phase 1D: コアUI

| Step | 内容 | 依存 |
|------|------|------|
| 17 | 条件入力ページ | Steps 2, 3, 6 |
| 18 | プラン表示・選択ページ | Step 17 |
| 19 | スケジュール表示 + リスケページ | Step 18 |
| 20 | リスケ API エンドポイント | Step 14 |

### Phase 1E: 決済連携

| Step | 内容 | 依存 |
|------|------|------|
| 21 | Stripe サービス | Step 5 |
| 22 | 決済 API エンドポイント | Steps 7, 21 |
| 23 | 決済 UI | Steps 22, 6 |

### Phase 1F: 補助ページ

| Step | 内容 | 依存 |
|------|------|------|
| 24 | ランディングページ | Steps 2, 3, 6 |
| 25 | セッション履歴ページ | Steps 4, 7 |
| 26 | 広告表示システム | Step 6 |

> Steps 24, 25, 26 は並列実行可能

### Phase 1G: テスト

| Step | 内容 | 依存 |
|------|------|------|
| 27 | ユニットテスト（サーバーロジック） | 各実装 Step |
| 28 | インテグレーションテスト（APIエンドポイント） | 全サーバー実装 |
| 29 | E2Eテスト（Playwright） | 全実装 |

### Phase 1H: デプロイ

| Step | 内容 | 依存 |
|------|------|------|
| 30 | Cloudflare デプロイ設定 + 本番リリース | 全 Step |

## 並列実行マップ

```
Step 1 (scaffolding)
  ├── Step 2 (Tailwind)  ─┐
  ├── Step 3 (i18n)      ─┼── Step 6 (共通UI)
  ├── Step 4 (DB)        ─┼── Step 7 (認証middleware) ── Steps 8,9,10 (並列) ── Step 11
  └── Step 5 (utils)     ─┤
                           ├── Steps 12,13 (並列) ── Step 14 ── Step 15
                           ├── Step 21 ── Step 22 ── Step 23
                           └── Steps 24,25,26 (並列)
```

## データベーススキーマ

### users
| カラム | 型 | 説明 |
|--------|-----|------|
| id | TEXT PK | UUID |
| email | TEXT UNIQUE | メールアドレス |
| password_hash | TEXT | パスワードハッシュ（OAuth時はnull） |
| display_name | TEXT | 表示名 |
| auth_provider | TEXT | 'google' / 'line' / 'email' |
| google_id | TEXT UNIQUE | Google ID |
| line_id | TEXT UNIQUE | LINE ID |
| free_session_used | INTEGER | 無料セッション使用済みフラグ (0/1) |
| created_at | TEXT | 作成日時 |

### trip_sessions
| カラム | 型 | 説明 |
|--------|-----|------|
| id | TEXT PK | UUID |
| user_id | TEXT FK | ユーザID |
| status | TEXT | 'input'/'generated'/'selected'/'active'/'completed'/'cancelled' |
| regeneration_count | INTEGER | 再生成回数（最大3） |
| is_free | INTEGER | 無料セッションフラグ (0/1) |
| origin_lat, origin_lng | REAL | 出発地座標 |
| budget_max | INTEGER | 予算上限（円） |
| time_start, time_end | TEXT | 開始・終了時刻 |
| transport_mode | TEXT | 交通手段 |

### plans
| カラム | 型 | 説明 |
|--------|-----|------|
| id | TEXT PK | UUID |
| trip_session_id | TEXT FK | セッションID |
| generation_round | INTEGER | 生成ラウンド番号 |
| plan_index | INTEGER | プラン番号 (0-2) |
| is_selected | INTEGER | 選択済みフラグ |
| title | TEXT | プランタイトル |
| total_budget | INTEGER | 推定合計予算（円） |
| plan_data | TEXT | JSON: スポット、飲食店、スケジュール、予算内訳 |

### reschedules
| カラム | 型 | 説明 |
|--------|-----|------|
| id | TEXT PK | UUID |
| plan_id | TEXT FK | プランID |
| trigger_lat, trigger_lng | REAL | リスケ発動時の座標 |
| trigger_time | TEXT | リスケ発動時刻 |
| new_schedule_data | TEXT | JSON: 更新されたスケジュール |
| status | TEXT | 'proposed'/'accepted'/'rejected' |

### payments
| カラム | 型 | 説明 |
|--------|-----|------|
| id | TEXT PK | UUID |
| user_id | TEXT FK | ユーザID |
| trip_session_id | TEXT FK | セッションID |
| stripe_payment_intent_id | TEXT | Stripe決済ID |
| amount | INTEGER | 金額（円） |
| status | TEXT | 'pending'/'succeeded'/'failed'/'refunded' |

## 技術的判断

| 項目 | 判断 | 理由 |
|------|------|------|
| Stripe連携 | REST API 直接利用 | Workers バンドルサイズ削減（SDK は ~500KB） |
| セッショントークン | ランダムトークン（JWT不使用） | 即時無効化可能、Workers でライブラリ不要 |
| パスワードハッシュ | Web Crypto API PBKDF2 | Workers ネイティブ対応、依存なし |
| Claude 利用方針 | 構造化データ渡し → プラン組み立てのみ | ハルシネーション防止、コスト削減 |
| プランデータ保存 | JSON TEXT カラム | スキーマの柔軟性確保 |

## リスクと対策

| リスク | 対策 |
|--------|------|
| Claude のハルシネーション | 検索させない。事前取得データのみ渡す。出力の place ID を入力と照合 |
| Google API コスト | 積極的キャッシュ。検索半径の制限。予算アラート設定 |
| Claude API コスト | プロンプト簡潔化。リスケには Haiku モデル検討 |
| Workers バンドルサイズ | 依存最小化。Web API 利用。Stripe SDK 不使用 |
| Stripe Webhook 信頼性 | 冪等処理。イベントID重複排除 |

## 完了基準

- [ ] メール / Google / LINE でログイン可能
- [ ] 旅行条件を入力しプラン生成できる
- [ ] 2〜3パターンから選択、再生成は最大3回
- [ ] スケジュール表示、手動リスケ機能動作
- [ ] 初回無料、2回目以降 Stripe 決済
- [ ] 全ページに広告表示
- [ ] i18n キー使用（日本語）
- [ ] モバイルファースト・レスポンシブ
- [ ] Cloudflare にデプロイ済み
- [ ] サーバーロジック テストカバレッジ 80%+
- [ ] シークレットのハードコードなし
- [ ] オブジェクトのミューテーションなし
- [ ] 全ファイル 800行以下
