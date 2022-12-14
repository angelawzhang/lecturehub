import type { HydratedDocument, Types } from "mongoose";
import UserModel, { User } from "../user/model";
import type { Course, TermLabel } from "./model";
import CourseModel from "./model";

class CourseCollection {
  static async getAllActive(): Promise<Array<HydratedDocument<Course>>> {
    return CourseModel.find({ active: true });
  }

  static async getAllStudentCourses(
    studentId: User
  ): Promise<Array<HydratedDocument<Course>>> {
    console.log(studentId);
    return CourseModel.find({
      enrolled: { $in: [studentId] },
    });
  }

  /**
   * Add a new course
   *
   * @param {string} name - The name of the course
   * @param {User} instructor - The instructor of the course
   * @param {TermLabel} term - The term of the course
   * @param {string} year - The year of the course
   * @return {Promise<HydratedDocument<Course>>} - The newly created course
   */
  static async addOne(
    name: string,
    instructor: User,
    term: TermLabel,
    year: string,
    description: string
  ): Promise<HydratedDocument<Course>> {
    const course = new CourseModel({
      name: name,
      enrolled: [],
      active: true,
      term: term,
      year: year,
      instructor: instructor,
      description: description
    });
    await course.save(); // Saves course to MongoDB
    return course;
  }

  /**
   * Find a course by courseId.
   *
   * @param {string} courseId - The courseId of the course to find
   * @return {Promise<HydratedDocument<Course>> | Promise<null>} - The course with the given id, if any
   */
  static async findOneByCourseId(
    courseId: Types.ObjectId | string
  ): Promise<HydratedDocument<Course>> {
    return CourseModel.findOne({ _id: courseId });
  }

  /**
   * Find courses by instructor.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<Course>[]> | Promise<null>} - The course with the given id, if any
   */
  static async findAllByInstructor(
    userId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Course>>> {
    return CourseModel.find({ instructor: userId });
  }

  /**
   * Activate a course.
   *
   * @param {string} courseId - The courseId of the course to activate
   * @return {Promise<HydratedDocument<Course>> | Promise<null>} - The course with the given id, if any
   */
  static async activateCourse(
    courseId: Types.ObjectId | string
  ): Promise<HydratedDocument<Course>> {
    const course = await CourseModel.findOne({ _id: courseId });
    course.active = true;
    await course.save();
    return course;
  }

  /**
   * Deactivate a course.
   *
   * @param {string} courseId - The courseId of the course to deactivate
   * @return {Promise<HydratedDocument<Course>> | Promise<null>} - The course with the given id, if any
   */
  static async deactivateCourse(
    courseId: Types.ObjectId | string
  ): Promise<HydratedDocument<Course>> {
    const course = await CourseModel.findOne({ _id: courseId });
    course.active = false;
    await course.save();
    return course;
  }

  /**
   * Add a student to a course.
   *
   * @param {string} userId - The userId of the student to add
   * @param {string} courseId - The courseId of the course to add to
   * @return {Promise<HydratedDocument<Course>> | Promise<null>} - The course with the given id
   */
  static async addStudent(
    userId: Types.ObjectId | string,
    courseId: Types.ObjectId | string
  ): Promise<HydratedDocument<Course>> {
    const course = await CourseModel.findOne({ _id: courseId });
    const user = await UserModel.findOne({ _id: userId });
    course.enrolled.push(user);
    await course.save();
    return course;
  }

  /**
   * Remove a student from a course.
   *
   * @param {string} userId - The userId of the student to remove
   * @param {string} courseId - The courseId of the course to remove from
   * @return {Promise<HydratedDocument<Course>> | Promise<null>} - The course with the given id
   */
  static async removeStudent(
    userId: Types.ObjectId | string,
    courseId: Types.ObjectId | string
  ): Promise<HydratedDocument<Course>> {
    const course = await CourseModel.findOne({ _id: courseId });
    const user = await UserModel.findOne({ _id: userId });
    for (var i = 0; i < course.enrolled.length; i++) {
      if (course.enrolled[i]._id == userId) {
        course.enrolled.splice(i, 1);
        break;
      }
    }
    await course.save();
    return course;
  }

  /**
   * Delete a course from the collection.
   *
   * @param {string} courseId - The courseId of course to delete
   * @return {Promise<Boolean>} - true if the course has been deleted, false otherwise
   */
  static async deleteOne(courseId: Types.ObjectId | string): Promise<boolean> {
    const course = await CourseModel.deleteOne({ _id: courseId });
    return course !== null;
  }
}

export default CourseCollection;
