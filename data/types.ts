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

export interface QuestionOption {
  text: string;
  scores: Partial<Record<ResultId, number>>;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export type AnswerMap = Record<string, number>;
