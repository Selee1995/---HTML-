# DATA_SCHEMA.md

## Result 类型

```ts
export type ResultId =
  | "hou_liangping"
  | "li_dakang"
  | "sha_ruijin"
  | "gao_yuliang"
  | "qi_tongwei"
  | "chen_hai"
  | "lu_yike"
  | "zhao_donglai"
  | "yi_xuexi"
  | "sun_liancheng"
  | "zhao_dehan"
  | "ding_yizhen";

export interface QuizResult {
  id: ResultId;
  name: string;
  archetype: string;
  summary: string;
  strengths: string[];
  risks: string[];
  advice: string;
  compatible: ResultId[];
  dangerous: ResultId[];
  shareText: string;
  priority: number;
}
```

## Question 类型

```ts
export interface QuestionOption {
  text: string;
  scores: Partial<Record<ResultId, number>>;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}
```

## 计分逻辑

1. 初始化所有角色分数为 0。
2. 遍历用户选择的所有选项。
3. 将每个选项里的 scores 累加到对应角色。
4. 找到最高分角色。
5. 如果并列，用 `priority` 决定。
6. 如果仍然并列，用 results 数组顺序决定。

## 数据维护建议

- 新增角色时，先更新 `ResultId`。
- 再在 `results.ts` 中添加完整结果。
- 然后在 `questions.ts` 中给新角色补充得分入口。
- 每道题的 4 个选项应尽量覆盖不同人格倾向。
