import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Course, TermLabel } from "./model";
import { User } from "server/user/model";

type CourseResponse = {
  _id: string;
  name: string;
  enrolled: Array<User>;
  active: boolean;
  term: string;
  year: string;
  instructor: User;
  description: string;
};

/**
 * Transform a raw Course object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Course>} course - A course object
 * @returns {CourseResponse} - The course object
 */
const constructCourseResponse = (
  course: HydratedDocument<Course>
): CourseResponse => {
  const courseCopy: Course = {
    ...course.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  return {
    ...courseCopy,
    _id: courseCopy._id.toString(),
    term: course.term.toString(),
  };
};

export { constructCourseResponse };
