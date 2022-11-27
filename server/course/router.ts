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
 * @return {CourseResponse} - The created course
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

export { router as courseRouter };
