import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: "q1",
    text: "你接手了一个前任留下来的烂项目，第一反应是？",
    options: [
      { text: "先查清责任链，不能让问题糊弄过去", scores: { hou_liangping: 3, chen_hai: 2, lu_yike: 1 } },
      { text: "先把项目推进起来，别让数据继续难看", scores: { li_dakang: 3, zhao_donglai: 2, sha_ruijin: 1 } },
      { text: "先观察谁能拍板，别贸然站队", scores: { gao_yuliang: 3, qi_tongwei: 2, ding_yizhen: 1 } },
      { text: "能拖就拖，别让锅落到自己头上", scores: { sun_liancheng: 3, ding_yizhen: 2, zhao_dehan: 1 } },
    ],
  },
  {
    id: "q2",
    text: "领导让你做一件边界模糊的事，你会怎么处理？",
    options: [
      { text: "不做，哪怕影响前途", scores: { hou_liangping: 3, chen_hai: 2, lu_yike: 2 } },
      { text: "先问清楚边界，能合规推进就推进", scores: { li_dakang: 2, zhao_donglai: 2, yi_xuexi: 2 } },
      { text: "判断是谁的意思，再决定怎么留余地", scores: { gao_yuliang: 3, qi_tongwei: 2 } },
      { text: "先保留证据，情况不对立刻切割", scores: { ding_yizhen: 3, sun_liancheng: 2, zhao_dehan: 1 } },
    ],
  },
  {
    id: "q3",
    text: "你最讨厌哪种同事？",
    options: [
      { text: "明明有问题却装看不见的人", scores: { hou_liangping: 2, lu_yike: 3, chen_hai: 2 } },
      { text: "天天开会但永远不解决问题的人", scores: { li_dakang: 3, zhao_donglai: 2 } },
      { text: "没能力还占着关键位置的人", scores: { qi_tongwei: 3, yi_xuexi: 2, li_dakang: 1 } },
      { text: "一出事就找替罪羊的人", scores: { sun_liancheng: 2, ding_yizhen: 2, zhao_dehan: 1 } },
    ],
  },
  {
    id: "q4",
    text: "如果你被冷落多年，你更可能怎么做？",
    options: [
      { text: "继续把事做好，等机会证明自己", scores: { yi_xuexi: 3, chen_hai: 2, zhao_donglai: 1 } },
      { text: "主动争取资源，不能一直被埋没", scores: { li_dakang: 2, qi_tongwei: 3 } },
      { text: "找到关键人，重新进入牌桌", scores: { gao_yuliang: 2, qi_tongwei: 3, ding_yizhen: 1 } },
      { text: "心态放平，工资照拿，少惹麻烦", scores: { sun_liancheng: 3, zhao_dehan: 1 } },
    ],
  },
  {
    id: "q5",
    text: "你对“上桌”的理解是？",
    options: [
      { text: "上不上桌不重要，重要的是规则公平", scores: { hou_liangping: 3, chen_hai: 2, lu_yike: 1 } },
      { text: "必须上桌，不然永远只能被安排", scores: { qi_tongwei: 3, li_dakang: 1 } },
      { text: "上桌以后也要守住边界", scores: { sha_ruijin: 3, yi_xuexi: 2, zhao_donglai: 1 } },
      { text: "只要别让我背锅，我可以不上桌", scores: { sun_liancheng: 3, ding_yizhen: 2 } },
    ],
  },
  {
    id: "q6",
    text: "一个重要会议上，所有人都在打太极，你会？",
    options: [
      { text: "直接把关键问题点出来", scores: { lu_yike: 3, hou_liangping: 2, chen_hai: 2 } },
      { text: "先定目标和时间表，把责任压实", scores: { li_dakang: 3, zhao_donglai: 2 } },
      { text: "观察各方态度，等真正能拍板的人表态", scores: { gao_yuliang: 3, sha_ruijin: 2 } },
      { text: "少说少错，先把会议纪要写得安全", scores: { sun_liancheng: 2, ding_yizhen: 2, zhao_dehan: 1 } },
    ],
  },
  {
    id: "q7",
    text: "你处理危机时最像哪种模式？",
    options: [
      { text: "查事实，找证据，谁的问题谁负责", scores: { hou_liangping: 3, lu_yike: 2, chen_hai: 2 } },
      { text: "先止血，再追责，别让局面扩大", scores: { zhao_donglai: 3, li_dakang: 2, sha_ruijin: 1 } },
      { text: "先判断危机会改变谁的位置", scores: { gao_yuliang: 3, qi_tongwei: 2 } },
      { text: "先确认自己有没有退路", scores: { ding_yizhen: 3, sun_liancheng: 2, zhao_dehan: 2 } },
    ],
  },
  {
    id: "q8",
    text: "你最看重一个团队的什么？",
    options: [
      { text: "底线清楚，不能什么都能商量", scores: { hou_liangping: 2, chen_hai: 2, yi_xuexi: 2 } },
      { text: "效率高，事情要真正往前走", scores: { li_dakang: 3, zhao_donglai: 2, lu_yike: 1 } },
      { text: "结构稳定，每个人知道自己的位置", scores: { sha_ruijin: 3, gao_yuliang: 2 } },
      { text: "风险可控，别突然把我卷进去", scores: { sun_liancheng: 3, ding_yizhen: 2, zhao_dehan: 1 } },
    ],
  },
  {
    id: "q9",
    text: "有人私下给你一个很诱人的机会，但边界不清楚，你会？",
    options: [
      { text: "直接拒绝，不想给自己埋雷", scores: { yi_xuexi: 3, chen_hai: 2, hou_liangping: 2 } },
      { text: "看是否能公开透明地做", scores: { li_dakang: 2, zhao_donglai: 2, sha_ruijin: 1 } },
      { text: "先研究机会背后的关系和代价", scores: { gao_yuliang: 3, qi_tongwei: 2 } },
      { text: "如果没人知道，也许可以试一下", scores: { zhao_dehan: 3, ding_yizhen: 2, qi_tongwei: 1 } },
    ],
  },
  {
    id: "q10",
    text: "你在组织里最常扮演的角色是？",
    options: [
      { text: "发现问题的人", scores: { hou_liangping: 3, lu_yike: 2 } },
      { text: "推进落地的人", scores: { li_dakang: 2, zhao_donglai: 3, yi_xuexi: 1 } },
      { text: "判断局势的人", scores: { sha_ruijin: 2, gao_yuliang: 3 } },
      { text: "降低存在感的人", scores: { sun_liancheng: 3, zhao_dehan: 1, ding_yizhen: 1 } },
    ],
  },
  {
    id: "q11",
    text: "如果你发现一个朋友正在越界，你会？",
    options: [
      { text: "直接提醒，严重的话必须制止", scores: { hou_liangping: 3, chen_hai: 2, lu_yike: 2 } },
      { text: "先看影响范围，再决定怎么处理", scores: { sha_ruijin: 2, zhao_donglai: 2, li_dakang: 1 } },
      { text: "私下劝一劝，尽量别撕破脸", scores: { gao_yuliang: 3, yi_xuexi: 1 } },
      { text: "离远一点，别让他把我拖下水", scores: { sun_liancheng: 2, ding_yizhen: 3, zhao_dehan: 1 } },
    ],
  },
  {
    id: "q12",
    text: "你对“关系”的态度更接近？",
    options: [
      { text: "关系不能凌驾于规则之上", scores: { hou_liangping: 3, chen_hai: 2, lu_yike: 1 } },
      { text: "关系是推进事情的工具，但不能失控", scores: { li_dakang: 2, zhao_donglai: 2, sha_ruijin: 2 } },
      { text: "关系本身就是局的一部分", scores: { gao_yuliang: 3, qi_tongwei: 2 } },
      { text: "关系越复杂，我越想退出群聊", scores: { sun_liancheng: 3, ding_yizhen: 1 } },
    ],
  },
  {
    id: "q13",
    text: "当你被误解时，你通常会？",
    options: [
      { text: "拿事实和证据解释清楚", scores: { hou_liangping: 2, lu_yike: 2, chen_hai: 2 } },
      { text: "先把结果做出来，让别人闭嘴", scores: { li_dakang: 3, yi_xuexi: 2 } },
      { text: "不急着解释，先看误解来自哪里", scores: { gao_yuliang: 3, sha_ruijin: 2 } },
      { text: "算了，少说少错，别扩大", scores: { sun_liancheng: 3, zhao_dehan: 1, ding_yizhen: 1 } },
    ],
  },
  {
    id: "q14",
    text: "你最容易在哪件事上失控？",
    options: [
      { text: "看到明显不公却没人管", scores: { hou_liangping: 3, lu_yike: 2, chen_hai: 2 } },
      { text: "看到项目被低效拖死", scores: { li_dakang: 3, zhao_donglai: 2 } },
      { text: "看到自己努力多年仍被挡在门外", scores: { qi_tongwei: 3, gao_yuliang: 1 } },
      { text: "看到风险开始靠近自己", scores: { ding_yizhen: 3, sun_liancheng: 2, zhao_dehan: 2 } },
    ],
  },
  {
    id: "q15",
    text: "如果你突然获得很大的权力，你最可能先做什么？",
    options: [
      { text: "清理长期被遮住的问题", scores: { hou_liangping: 3, sha_ruijin: 2, lu_yike: 1 } },
      { text: "重排目标，推动一批硬项目", scores: { li_dakang: 3, zhao_donglai: 2 } },
      { text: "重建秩序，让关键位置回到可控状态", scores: { sha_ruijin: 3, gao_yuliang: 2 } },
      { text: "先确保自己不会被反噬", scores: { qi_tongwei: 2, ding_yizhen: 2, zhao_dehan: 1 } },
    ],
  },
  {
    id: "q16",
    text: "最后一题：你觉得自己在复杂组织里最大的生存武器是？",
    options: [
      { text: "原则和证据", scores: { hou_liangping: 3, chen_hai: 2, lu_yike: 2 } },
      { text: "执行力和结果", scores: { li_dakang: 3, zhao_donglai: 2, yi_xuexi: 1 } },
      { text: "判断力和耐心", scores: { sha_ruijin: 2, gao_yuliang: 3 } },
      { text: "风险嗅觉和退路", scores: { sun_liancheng: 2, ding_yizhen: 3, zhao_dehan: 2 } },
    ],
  },
];
