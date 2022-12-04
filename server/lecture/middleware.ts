import type { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import LectureModel from "./model";

/**
 * Checks if the course ID is a valid course
 */
const isValidLectureId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValidLecture = req.query.lectureId
    ? isValidObjectId(req.query.lectureId)
    : isValidObjectId(req.body.lectureId);
  const lectureId = req.query.lectureId
    ? req.query.lectureId
    : req.body.lectureId;
  const lecture = isValidLecture ? await LectureModel.findById(lectureId) : "";
  if (!lecture) {
    res.status(404).json({
      error: "Lecture ID is not valid",
    });
    return;
  }
  next();
};

export { isValidLectureId };
