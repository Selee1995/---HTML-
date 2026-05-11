import type { AnswerMap, Question, QuizResult, ResultId } from "../data/types";

export function calculateResult(
  questions: Question[],
  results: QuizResult[],
  answers: AnswerMap
): QuizResult {
  const scores = Object.fromEntries(results.map((result) => [result.id, 0])) as Record<ResultId, number>;

  for (const question of questions) {
    const selectedIndex = answers[question.id];
    if (selectedIndex === undefined) continue;

    const selectedOption = question.options[selectedIndex];
    if (!selectedOption) continue;

    for (const [resultId, value] of Object.entries(selectedOption.scores)) {
      scores[resultId as ResultId] += value ?? 0;
    }
  }

  const sorted = [...results].sort((a, b) => {
    const scoreDiff = scores[b.id] - scores[a.id];
    if (scoreDiff !== 0) return scoreDiff;

    const priorityDiff = b.priority - a.priority;
    if (priorityDiff !== 0) return priorityDiff;

    return results.indexOf(a) - results.indexOf(b);
  });

  return sorted[0];
}

export function getScoreMap(
  questions: Question[],
  results: QuizResult[],
  answers: AnswerMap
): Record<ResultId, number> {
  const scores = Object.fromEntries(results.map((result) => [result.id, 0])) as Record<ResultId, number>;

  for (const question of questions) {
    const selectedIndex = answers[question.id];
    if (selectedIndex === undefined) continue;

    const selectedOption = question.options[selectedIndex];
    if (!selectedOption) continue;

    for (const [resultId, value] of Object.entries(selectedOption.scores)) {
      scores[resultId as ResultId] += value ?? 0;
    }
  }

  return scores;
}
