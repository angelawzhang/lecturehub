import type { Request, Response } from "express";
import express from "express";
import CourseCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as courseValidator from "./middleware";
import * as util from "./util";
import { TermLabel } from "./model";

const router = express.Router();

/**
 * Create a course.
 *
 * @name POST /api/course
 *
 * @param {string} name - name of the course
 * @param {TermLabel} term - term of the course
 * @param {string} year - year of the course
 * @return {CourseResponse} - the created course
 *
 */

router.post(
  "/",
  [userValidator.isUserLoggedIn, courseValidator.isInstructor],
  async (req: Request, res: Response) => {
    const course = await CourseCollection.addOne(
      req.body.name,
      req.session.userId,
      req.body.term,
      req.body.year
    );
    res.status(201).json({
      message: "Your course was created successfully.",
      course: util.constructCourseResponse(course),
    });
  }
);

/**
 * Activate a course.
 *
 * @name PATCH /api/course
 *
 * @param {string} courseId - id of the course
 * @return {CourseResponse} - the activated course
 *
 */

router.patch(
  "/activate",
  [userValidator.isUserLoggedIn, courseValidator.isInstructor],
  async (req: Request, res: Response) => {
    const course = await CourseCollection.activateCourse(req.body.courseId);
    res.status(201).json({
      message: "Your course was activated successfully.",
      course: util.constructCourseResponse(course),
    });
  }
);

/**
 * Deactivate a course.
 *
 * @name PATCH /api/course
 *
 * @param {string} courseId - id of the course
 * @return {CourseResponse} - the deactivated course
 *
 */

router.patch(
  "/deactivate",
  [userValidator.isUserLoggedIn, courseValidator.isInstructor],
  async (req: Request, res: Response) => {
    const course = await CourseCollection.deactivateCourse(req.body.courseId);
    res.status(201).json({
      message: "Your course was deactivated successfully.",
      course: util.constructCourseResponse(course),
    });
  }
);

export { router as courseRouter };
