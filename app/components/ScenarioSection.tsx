"use client";

import React from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { getTranslation } from "@/lib/i18n";

export type ScenarioType =
  | "study1-medium"
  | "study2-high"
  | "study2-low";

const scenarioText: Record<ScenarioType, Record<"zh" | "en", string>> = {
  "study1-medium": {
    zh: `您是"趣友圈"的创始人，这是一款面向年轻人的新型社交应用。当前，您的产品正面临一个关键的决策节点：是否在资金较为紧张的情况下，冒险推出一项创新功能——线下活动组队功能。

"趣友圈"目前拥有20万月活用户，资金可支撑约8个月的运营，用户增长遇到瓶颈，竞争对手也日益增多。线下活动组队功能允许用户根据兴趣发起或参加本地活动，有望提升用户活跃度和粘性。

关于这个功能是否能够成功、如何定价、如何推广，并不存在唯一正确的做法，充满高度不确定性。`,
    en: `You are the founder of "QuYouQuan", a new social app for young people. Currently, your product is facing a critical decision point: whether to launch an innovative feature—offline event grouping—despite tight funding.

"QuYouQuan" currently has 200,000 monthly active users, with funds to support approximately 8 months of operation. User growth has hit a bottleneck, and competitors are increasing. The offline event grouping feature allows users to initiate or join local events based on interests, potentially improving user engagement and retention.

There is no single correct approach regarding whether this feature will succeed, how to price it, or how to promote it. The situation is highly uncertain.`,
  },
  "study2-high": {
    zh: `您是"趣友圈"的创始人，这是一款面向年轻人的新型社交应用。当前，您的产品正面临一个关键的决策节点：是否在资金较为紧张的情况下，冒险推出一项创新功能——线下活动组队功能。

"趣友圈"目前拥有20万月活用户，资金可支撑约8个月的运营，用户增长遇到瓶颈，竞争对手也日益增多。线下活动组队功能允许用户根据兴趣发起或参加本地活动，有望提升用户活跃度和粘性。

您的团队进行了广泛的市场调研，获得了以下详细数据：
- 用户调研数据：在4500名活跃用户问卷调研中，72%表示对线下活动功能"非常感兴趣"或"比较感兴趣"；用户愿意为单次活动支付的平均价格为28元；最受欢迎的活动类型依次为：桌游(34%)、户外运动(28%)、手工DIY(18%)、读书会(12%)、其他(8%)
- 竞品分析报告：3家主要竞品的线下活动功能活跃率为日活的15%-22%；竞品平均客单价为25-35元；市场存在明确的头部效应，先发者优势显著
- 运营成本核算：功能开发需投入约45万元，周期3个月；每场活动运营成本约为收入的40%；达到盈亏平衡需月均举办2400场活动
- 用户增长预测：基于历史数据模型，新功能预计带来月均15%的用户增长；6个月内有望突破35万月活用户`,
    en: `You are the founder of "QuYouQuan", a new social app for young people. Currently, your product is facing a critical decision point: whether to launch an innovative feature—offline event grouping—despite tight funding.

"QuYouQuan" currently has 200,000 monthly active users, with funds to support approximately 8 months of operation. User growth has hit a bottleneck, and competitors are increasing. The offline event grouping feature allows users to initiate or join local events based on interests, potentially improving user engagement and retention.

Your team has conducted extensive market research and obtained the following detailed data:
- User research data: In a survey of 4,500 active users, 72% expressed "very interested" or "somewhat interested" in the offline event feature; the average price users are willing to pay per event is 28 yuan; the most popular event types are: board games (34%), outdoor sports (28%), handicraft DIY (18%), book clubs (12%), others (8%)
- Competitive analysis report: The offline event feature activity rate of 3 major competitors is 15%-22% of daily active users; competitor average order value is 25-35 yuan; the market shows clear head effects with significant first-mover advantages
- Operating cost calculation: Feature development requires an investment of approximately 450,000 yuan with a 3-month cycle; operating cost per event is about 40% of revenue; break-even requires an average of 2,400 events per month
- User growth forecast: Based on historical data models, the new feature is expected to bring 15% monthly user growth; monthly active users are expected to exceed 350,000 within 6 months`,
  },
  "study2-low": {
    zh: `您是"趣友圈"的创始人，这是一款面向年轻人的新型社交应用。当前，您的产品正面临一个关键的决策节点：是否在资金较为紧张的情况下，冒险推出一项创新功能——线下活动组队功能。

"趣友圈"目前拥有20万月活用户，资金可支撑约8个月的运营，用户增长遇到瓶颈，竞争对手也日益增多。线下活动组队功能允许用户根据兴趣发起或参加本地活动，有望提升用户活跃度和粘性。

您面临着高度的不确定性，关于这个功能是否能够成功、如何定价、如何推广：
- 用户反馈信息：仅有少量用户在社区中提及过希望有线下社交功能，但具体需求不明确；用户对价格的接受程度完全未知；哪些活动类型会受欢迎也不得而知
- 市场环境信息：竞争对手中有1-2家似乎在测试类似功能，但具体进展不明；线下活动社交在国内是否有成熟模式尚不清楚；该领域的商业模式尚未被验证
- 内部资源信息：开发成本和周期难以准确估计，因为团队未做过类似功能；运营成本的合理比例无历史参考；达到盈亏平衡的条件无法预测
- 增长前景信息：新功能是否能带动用户增长完全不确定；用户对这类功能的接受曲线未知`,
    en: `You are the founder of "QuYouQuan", a new social app for young people. Currently, your product is facing a critical decision point: whether to launch an innovative feature—offline event grouping—despite tight funding.

"QuYouQuan" currently has 200,000 monthly active users, with funds to support approximately 8 months of operation. User growth has hit a bottleneck, and competitors are increasing. The offline event grouping feature allows users to initiate or join local events based on interests, potentially improving user engagement and retention.

You face high uncertainty regarding whether this feature will succeed, how to price it, and how to promote it:
- User feedback information: Only a small number of users have mentioned wanting offline social features in the community, but specific needs are unclear; user price acceptance is completely unknown; which event types will be popular is also unknown
- Market environment information: 1-2 competitors seem to be testing similar features, but specific progress is unclear; whether offline event social networking has a mature model in China is unclear; the business model in this field has not been validated
- Internal resource information: Development costs and cycles are difficult to estimate accurately because the team has not done similar features; there is no historical reference for reasonable operating cost ratios; break-even conditions cannot be predicted
- Growth prospects information: Whether the new feature can drive user growth is completely uncertain; user acceptance curves for such features are unknown`,
  },
};

type Props = {
  type: ScenarioType;
};

export const ScenarioSection: React.FC<Props> = ({ type }) => {
  const { lang } = useLanguage();
  const t = (key: string) => getTranslation(lang, key);

  return (
    <div className="border rounded-md p-4 bg-gray-50 text-sm leading-relaxed whitespace-pre-wrap max-h-[260px] overflow-y-auto">
      <div className="font-semibold mb-2">{t("task.scenario")}</div>
      {scenarioText[type][lang]}
    </div>
  );
};
