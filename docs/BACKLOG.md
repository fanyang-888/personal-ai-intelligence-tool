# Backlog — 通过但不阻塞（Day 3 前可不交付）

以下条目 **不卡** Week 2 Day 2 / Day 3 起步验收；仅作后续工程债与风险备忘。

---

## 1. `sources` 表与 YAML 配置仍分离

**现状**：可信源在 [`backend/app/source_catalog/trusted_sources.yaml`](../backend/app/source_catalog/trusted_sources.yaml) 中定义并驱动适配器；PostgreSQL `sources` 由 seed / 迁移维护。当前分工清晰。

**风险**：长期 **双源**（file config ↔ DB）可能 **漂移**（slug、`feed_url` / `index_url`、是否启用等与运行时不一致）。

**后续方向（择一或组合）**：确立单一事实来源（SSOT）；或增加显式同步（例如 YAML → `sources` upsert、或 DB 为权威 + 导出给运维）。

---

## 2. OpenAI / Anthropic 的 HTML fallback 未完整实现

**现状**：Day 2 验收以 **index items（候选列表）** 为主。OpenAI 在 RSS 为空时目前仅 **打日志**，未实现等价 HTML 索引抓取。Anthropic 以 HTML index 为主路径；若将来配置 RSS 后 RSS 失败，再回落 HTML 的路径需与产品预期对齐。

**风险**：公开 **RSS 失效或改版** 时，仅依赖「不完整 HTML fallback」会变成生产风险点。

**后续**：Day 3+ 补齐与 RSS 对等的 **HTML index（及必要时正文）** 抓取与解析，并在 dry run / 监控中覆盖该路径。

---

## 3. 尚非「增量抓取完整闭环」

**现状**：当前重点是 **抓到规范化后的 candidate list**；YAML 层已有 `since_date`、`import_limit` 等 **非持久化** 的欠账控制，不等于增量状态机。

**后续（典型拼图）**：`last_polled_at`、HTTP **`ETag` / `Last-Modified`**、按源游标、与 `articles` 持久化及全文拉取（`fetch_article`）串联，形成可观测的端到端增量闭环。
