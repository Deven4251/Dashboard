import { recordActivity } from "../services/activityService.js";
import { answerProjectQuestion } from "../services/assistantService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const askAssistant = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question?.trim()) throw new HttpError("Question is required", 400);

  const answer = await answerProjectQuestion(req.user._id, question.trim());
  await recordActivity({ owner: req.user._id, type: "system", title: "Assistant question asked", description: question });
  res.json({ answer, provider: "local-project-context" });
});
