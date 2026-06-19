import mongoose from "mongoose";
import { HttpError } from "../utils/httpError.js";

export const validateObjectId = (param = "id") => (req, _res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
    return next(new HttpError("Invalid id", 400));
  }
  return next();
};
