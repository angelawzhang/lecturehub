import type { HydratedDocument, Types } from "mongoose";
import { Course } from "../course/model";
import LectureModel, { Lecture } from "./model";

class LectureCollection {
  /**
   * Add a new lecture
   *
   * @param {string} name - The name of the lecture
   * @param {Course} course - The lecture's course
   * @param {Date} date - The date of the lecture
   * @param {string} src - The video link of the lecture
   * @return {Promise<HydratedDocument<Lecture>>} - The newly created lecture
   */
  static async addOne(
    name: string,
    course: Course,
    date: Date,
    src: string
  ): Promise<HydratedDocument<Lecture>> {
    const lecture = new LectureModel({
      name: name,
      course: course,
      date: date,
      src: src,
    });
    await lecture.save(); // Saves lecture to MongoDB
    return lecture;
  }

  /**
   * Find a lecture by lectureId.
   *
   * @param {string} lectureId - The lectureId of the lecture to find
   * @return {Promise<HydratedDocument<Lecture>> | Promise<null>} - The lecture with the given id, if any
   */
  static async findOneByLectureId(
    lectureId: Types.ObjectId | string
  ): Promise<HydratedDocument<Lecture>> {
    return LectureModel.findOne({ _id: lectureId });
  }

  /**
   * Find lectures by course.
   *
   * @param {string} courseId - The courseId of the course to find
   * @return {Promise<HydratedDocument<Lecture>[]> | Promise<null>} - The lectures with the given course, if any
   */
  static async findAllByCourse(
    courseId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Lecture>>> {
    return LectureModel.find({ course: courseId });
  }

  /**
   * Delete a lecture from the collection.
   *
   * @param {string} lectureId - The lectureId of lecture to delete
   * @return {Promise<Boolean>} - true if the lecture has been deleted, false otherwise
   */
  static async deleteOne(lectureId: Types.ObjectId | string): Promise<boolean> {
    const lecture = await LectureModel.deleteOne({ _id: lectureId });
    return lecture !== null;
  }
}

export default LectureCollection;
