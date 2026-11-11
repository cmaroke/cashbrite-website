import { categoryLabels, type QuizCategory } from "@/data/quizQuestions";
import type { QuizScores } from "@/lib/quizScoring";

const categoryOrder = Object.keys(categoryLabels) as QuizCategory[];

export const priorityTieExplanation =
  "When topics share a score, we use assessment order to choose three focus areas. Their order does not indicate different levels of urgency.";

// Canonical order is the explicit tie-break, including for stored JSON with reordered keys.
export function selectPriorityCategories(scores: Pick<QuizScores, "categoryScores">): QuizCategory[] {
  return [...categoryOrder]
    .sort((a, b) =>
      scores.categoryScores[a].percentage - scores.categoryScores[b].percentage ||
      categoryOrder.indexOf(a) - categoryOrder.indexOf(b),
    )
    .slice(0, 3);
}
