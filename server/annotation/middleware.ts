import type { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import AnnotationCollection from "./collection";
import AnnotationModel from "./model";

/**
 * Checks if the lecture ID is a valid lecture
 */
const isValidLectureId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validLecture = req.query.lectureId
    ? isValidObjectId(req.query.lectureId)
    : isValidObjectId(req.body.lectureId);
  const lectureId = req.query.lectureId
    ? req.query.lectureId
    : req.body.lectureId;
  // TODO: implement when LectureModel is added.
  // const annotation = validLecture ? await LectureModel.findById(lectureId) : "";
  // if (!annotation) {
  //   res.status(404).json({
  //     error: "Lecture ID is not valid",
  //   });
  //   return;
  // }
  next();
};

/**
 * Checks if the annotation ID is a valid annotation
 */
const isValidAnnotationId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const annotationId = req.body.annotationId ? req.body.annotationId : req.params.annotationId;
  const isValidId = isValidObjectId(annotationId);
  const annotation = isValidId ? await AnnotationModel.findById(annotationId) : "";
  if (!annotation) {
    res.status(404).json({
      error: "Annotation ID is not valid",
    });
    return;
  }
  
  next();
};

/**
 * Checks if the content of the annotation is not empty
 * and not a series of whitespace
 */
const isValidAnnotationContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.content) {
    res.status(400).json({
      error: "No content provided",
    });
    return;
  } else if (!req.body.content.trim()) {
    res.status(400).json({
      error: "Content cannot be empty",
    });
    return;
  }

  next();
};

/**
 * Checks if the hour, minute, and second passed in are valid
 */
const isValidTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let invalidHour = req.body.hour ? isNaN(req.body.hour) : false;
  let invalidMinute = req.body.minute ? isNaN(req.body.minute) : false;
  let invalidSecond = req.body.second ? isNaN(req.body.second) : false;

  if (invalidHour || invalidMinute || invalidSecond) {
    res.status(400).json({
      error: "Improperly formatted time",
    });
    return;
  }

  next();
}

export {
  isValidLectureId,
  isValidAnnotationId,
  isValidAnnotationContent,
  isValidTime
};
