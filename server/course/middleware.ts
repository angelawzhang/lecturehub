import type { Request, Response, NextFunction } from "express";
import UserModel from "../user/model";
import UserCollection from "../user/collection";
import CourseCollection from "./collection";
import { isValidObjectId } from "mongoose";
import CourseModel from "./model";

/**
 * Checks if a name in req.body is valid, that is, it matches the name regex
 */
const isValidName = (req: Request, res: Response, next: NextFunction) => {
  const nameRegex = /^[\w\-\s]+$/i;
  if (!nameRegex.test(req.body.name)) {
    res.status(400).json({
      error: "Name must be a nonempty alphanumeric string.",
    });
    return;
  }
  next();
};

/**
 * Checks if current user is an instructor
 */
const isInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await UserCollection.findOneByUserId(
    req.session.userId as string
  );
  if (user.isStudent) {
    res.status(403).json({
      error: `The user is not an instructor and doesn't have permissions to complete this action.`,
    });
    return;
  }
  next();
};

/**
 * Checks if userId is enrolled
 */
const isEnrolled = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.body.userId as string);
  const course = await CourseCollection.findOneByCourseId(
    req.body.courseId as string
  );
  if (!course.enrolled.includes(req.body.userId)) {
    res.status(404).json({
      error: `The requested student is currently not enrolled in the course.`,
    });
    return;
  }
  next();
};

/**
 * Checks if the user ID is a valid user
 */
const isValidUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValidUser = req.query.userId
    ? isValidObjectId(req.query.userId)
    : isValidObjectId(req.body.userId);
  const userId = req.query.userId ? req.query.userId : req.body.userId;
  const post = isValidUser ? await UserModel.findById(userId) : "";
  if (!post) {
    res.status(404).json({
      error: "User ID is not valid",
    });
    return;
  }
  next();
};

/**
 * Checks if the course ID is a valid course
 */
const isValidCourseId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValidCourse = req.query.courseId
    ? isValidObjectId(req.query.courseId)
    : isValidObjectId(req.body.courseId);
  const courseId = req.query.courseId ? req.query.courseId : req.body.courseId;
  const course = isValidCourse ? await CourseModel.findById(courseId) : "";
  if (!course) {
    res.status(404).json({
      error: "Course ID is not valid",
    });
    return;
  }
  next();
};

export {
  isValidName,
  isInstructor,
  isEnrolled,
  isValidUserId,
  isValidCourseId,
};
