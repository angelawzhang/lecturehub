import type { NextFunction, Request, Response } from "express";
import express from "express";
import CourseCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as courseValidator from "./middleware";
import * as util from "./util";
import * as userUtil from "../user/util";
import { TermLabel } from "./model";
import UserCollection from "../user/collection";

const router = express.Router();

router.get(
  "/",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const courses = await CourseCollection.getAllActive();
    res.status(200).json({
      message: "Your courses were found sucessfully",
      courses: courses.map(util.constructCourseResponse),
    });
  }
);
/**
 * Get a course.
 *
 * @name GET /api/course/id?courseId=id
 *
 * @param {string} courseId - id of the course
 * @return {CourseResponse} - the course
 *
 * @throws {403} - if the user is not logged in or instructor
 * @throws {404} - if the course id is not valid
 *
 */
router.get(
  "/id",
  [userValidator.isUserLoggedIn, courseValidator.isValidCourseId],
  async (req: Request, res: Response) => {
    const course = await CourseCollection.findOneByCourseId(
      req.query.courseId as string
    );
    res.status(200).json({
      message: "Your course info was found successfully.",
      course: course ? util.constructCourseResponse(course) : null,
    });
  }
);

/**
 * @name GET /api/course/student
 */
router.get(
  "/student",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const courses = await CourseCollection.getAllStudentCourses(
      req.session.userId
    );
    res.status(200).json({
      message: "Your course info was found successfully.",
      courses: courses.map(util.constructCourseResponse),
    });
  }
);

/**
 * Get course by instructor.
 *
 * @name GET /api/course/instructor?userId=id
 *
 * @param {string} userId - id of the instructor
 * @return {CourseResponse} - the courses
 *
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the user id is not valid
 *
 */

router.get(
  "/instructor",
  [
    userValidator.isUserLoggedIn,
    courseValidator.isInstructor,
    courseValidator.isValidUserId,
  ],
  async (req: Request, res: Response) => {
    const courses = await CourseCollection.findAllByInstructor(
      req.query.userId as string
    );
    const courseResponse = courses.map(util.constructCourseResponse);
    res.status(200).json({
      message: "Your course info was found successfully.",
      courses: courses ? courseResponse : null,
    });
  }
);

/**
 * Get the instructor of a course
 *
 * @name GET /api/course/instructor-name?courseId=id
 *
 * @param {string} courseId - The course id
 * @return {UserResponse}
 *
 */
router.get(
  "/instructor-name",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const course = await CourseCollection.findOneByCourseId(
      req.query.courseId as string
    );
    const user = await UserCollection.findOneByUserId(
      course.instructor._id.toString()
    );
    res.status(200).json({
      message: "Your user info was found successfully.",
      user: user ? userUtil.constructUserResponse(user) : null,
    });
  }
);

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
 * @throws {400} - if the course name is invalid
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
 * @name PATCH /api/course/activate
 *
 * @param {string} courseId - id of the course
 * @return {CourseResponse} - the activated course
 *
 * @throws {403} - if the user is not logged in or instructor
 * @throws {404} - if the courseId is not valid
 *
 */

router.patch(
  "/activate",
  [
    userValidator.isUserLoggedIn,
    courseValidator.isInstructor,
    courseValidator.isValidCourseId,
  ],
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
 * @name PATCH /api/course/deactivate
 *
 * @param {string} courseId - id of the course
 * @return {CourseResponse} - the deactivated course
 *
 * @throws {403} - if the user is not logged in or instructor
 * @throws {404} - if the courseId is not valid
 *
 */

router.patch(
  "/deactivate",
  [
    userValidator.isUserLoggedIn,
    courseValidator.isInstructor,
    courseValidator.isValidCourseId,
  ],
  async (req: Request, res: Response) => {
    const course = await CourseCollection.deactivateCourse(req.body.courseId);
    res.status(201).json({
      message: "Your course was deactivated successfully.",
      course: util.constructCourseResponse(course),
    });
  }
);

/**
 * Add a student to a course.
 *
 * @name PATCH /api/course/add-student
 *
 * @param {string} userId - id of the student
 * @param {string} courseId - id of the course
 * @return {CourseResponse}
 *
 * @throws {403} - if the user is not logged in or instructor
 * @throws {404} - if the given user id or course id is not found
 */

router.patch(
  "/add-student",
  [userValidator.isUserLoggedIn, courseValidator.isValidCourseId],
  async (req: Request, res: Response) => {
    const course = await CourseCollection.addStudent(
      req.session.userId,
      req.body.courseId
    );
    res.status(201).json({
      message: "The student was added successfully.",
      course: util.constructCourseResponse(course),
    });
  }
);

/**
 * Delete a student from a course.
 *
 * @name PATCH /api/course/delete-student
 *
 * @param {string} userId - id of the student
 * @param {string} courseId - id of the course
 * @return {CourseResponse}
 *
 * @throws {403} - if the user is not logged in or instructor
 * @throws {404} - if the requested student is not enrolled
 * @throws {404} - if the given user id or course id is not found
 */

router.patch(
  "/delete-student",
  [userValidator.isUserLoggedIn, courseValidator.isValidCourseId],
  async (req: Request, res: Response) => {
    const course = await CourseCollection.removeStudent(
      req.session.userId,
      req.body.courseId
    );
    res.status(201).json({
      message: "The student was removed successfully.",
      course: util.constructCourseResponse(course),
    });
  }
);

/**
 * Deletes a course
 *
 * @name DELETE /api/course
 *
 * @param {string} courseId - the id of the course
 * @throws {403} - if the user is not logged in or not the instructor
 * @throws {404} - if the course id is not valid
 */
router.delete(
  "/",
  [
    userValidator.isUserLoggedIn,
    courseValidator.isInstructor,
    courseValidator.isValidCourseId,
  ],
  async (req: Request, res: Response) => {
    await CourseCollection.deleteOne(req.body.courseId);
    res.status(200).json({
      message: "Course successfully deleted",
    });
  }
);

export { router as courseRouter };
