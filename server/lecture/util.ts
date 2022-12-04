import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Lecture } from "./model";

type LectureResponse = {
  _id: string;
  name: string;
  courseId: string;
  date: string;
  src: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string =>
  moment(date).format("MMMM Do YYYY, h:mm:ss a");

/**
 * Transform a raw Lecture object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<Lecture>} lecture - A lecture object
 * @returns {LectureResponse} - The lecture object
 */
const constructLectureResponse = (
  lecture: HydratedDocument<Lecture>
): LectureResponse => {
  const lectureCopy: Lecture = {
    ...lecture.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  return {
    ...lectureCopy,
    _id: lectureCopy._id.toString(),
    courseId: lecture.course._id.toString(),
    date: formatDate(lecture.date),
  };
};

export { constructLectureResponse };
