import type { Request, Response } from "express";
import express from "express";
import LectureCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as courseValidator from "../course/middleware";
import * as lectureValidator from "./middleware";
import * as util from "./util";

const router = express.Router();

/**
 * Get a lecture.
 *
 * @name GET /api/lecture/id?lectureId=id
 *
 * @param {string} lectureId - id of the lecture
 * @return {LectureResponse} - the lecture
 *
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the lecture id is not valid
 *
 */
router.get(
  "/id",
  [userValidator.isUserLoggedIn, lectureValidator.isValidLectureId],
  async (req: Request, res: Response) => {
    const lecture = await LectureCollection.findOneByLectureId(
      req.query.lectureId as string
    );
    res.status(200).json({
      message: "Your lecture info was found successfully.",
      lecture: lecture ? util.constructLectureResponse(lecture) : null,
    });
  }
);

/**
 * Get lectures by course.
 *
 * @name GET /api/lecture/course?courseId=id
 *
 * @param {string} courseId - id of the course
 * @return {LectureResponse} - the lecture
 *
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the course id is not valid
 *
 */

router.get(
  "/course",
  [userValidator.isUserLoggedIn, courseValidator.isValidCourseId],
  async (req: Request, res: Response) => {
    const lectures = await LectureCollection.findAllByCourse(
      req.query.courseId as string
    );
    const lectureResponse = lectures.map(util.constructLectureResponse);
    res.status(200).json({
      message: "Your lecture info was found successfully.",
      lectures: lectures ? lectureResponse : null,
    });
  }
);

/**
 * Create a lecture.
 *
 * @name POST /api/lecture
 *
 * @param {string} name - name of the lecture
 * @param {Course} course - course of the lecture
 * @param {Date} date - date of the lecture
 * @param {string} src - video link of the lecture
 * @return {LectureResponse} - the created lecture
 *
 * @throws {400} - if the lecture name is invalid
 * @throws {403} - if the user is not logged in or instructor
 *
 */

router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    courseValidator.isInstructor,
    courseValidator.isValidName,
  ],
  async (req: Request, res: Response) => {
    const lecture = await LectureCollection.addOne(
      req.body.name,
      req.body.course,
      req.body.date,
      req.body.src
    );
    res.status(201).json({
      message: "Your lecture was created successfully.",
      lecture: util.constructLectureResponse(lecture),
    });
  }
);

/**
 * Deletes a lecture
 *
 * @name DELETE /api/lecture
 *
 * @param {string} lectureId - the id of the lecture
 * @throws {403} - if the user is not logged in or not the instructor
 * @throws {404} - if the lecture id is not valid
 */
router.delete(
  "/",
  [
    userValidator.isUserLoggedIn,
    courseValidator.isInstructor,
    lectureValidator.isValidLectureId,
  ],
  async (req: Request, res: Response) => {
    await LectureCollection.deleteOne(req.body.lectureId);
    res.status(200).json({
      message: "Lecture successfully deleted",
    });
  }
);

export { router as lectureRouter };
