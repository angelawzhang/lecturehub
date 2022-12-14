import type { HydratedDocument, Types } from "mongoose";
import type { Annotation } from "./model";
import AnnotationModel from "./model";

class AnnotationCollection {
  /**
   * Add a Annotation to the collection
   *
   * @param {string} authorId - The id of the author
   * @param {string} lectureId - The id of the lecture the annotation corresponds to
   * @param {Number} hour - The hour of the point in video the annotation correponds to
   * @param {Number} minute - The minute of the point in video the annotation correponds to
   * @param {Number} second - The second of the point in video the annotation correponds to
   * @param {string} content - The content of the annotation
   * @returns {Promise<HydratedDocument<Annotation>>} - The created Annotation
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    lectureId: Types.ObjectId | string,
    hour: Number,
    minute: Number,
    second: Number,
    content: string
  ): Promise<HydratedDocument<Annotation>> {
    const date = new Date();
    const annotation = new AnnotationModel({
      authorId: authorId,
      lectureId: lectureId,
      hour: hour,
      minute: minute,
      second: second,
      content: content,
      dateCreated: date,
    });

    await annotation.save();
    return annotation.populate("authorId");
  }

  /**
   *
   * Find all annotations with a given parent lecture with lectureId and authorId.
   *
   * @param {string} lectureId - The ID of the lecture
   * @param {string} authorId - The ID of the annotation author

   * @returns {Promise<Array<HydratedDocument<Annotation>>>} - An array of matching annotations
   */
  static async findAllByLectureAndAuthor(
    lectureId: Types.ObjectId | string,
    authorId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Annotation>>> {
    return AnnotationModel.find({ lectureId: lectureId, authorId: authorId })
      .sort({ hour: 1, minute: 1, second: 1 })
      .populate("authorId");
  }

  /**
   *
   * Find all annotations with a given authorId.
   *
   * @param {string} authorId - The ID of the annotation author

   * @returns {Promise<Array<HydratedDocument<Annotation>>>} - An array of matching annotations
   */
  static async findAllByAuthor(
    authorId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Annotation>>> {
    return AnnotationModel.find({ authorId: authorId });
  }

  /**
   *
   * Updates a annotation in the collection
   *
   * @param {string} annotationId - The ID of the annotation to be updated
   * @param {string} content - The new content of the annotation
   * @returns {Promise<HydratedDocument<Annotation>>} - The updated annotation
   */
  static async updateOne(
    annotationId: Types.ObjectId | string,
    content?: string,
    hour?: Number,
    minute?: Number,
    second?: Number
  ): Promise<HydratedDocument<Annotation>> {
    const annotation = await AnnotationModel.findById(annotationId);
    if (content) {
      annotation.content = content;
    }

    if (hour) {
      annotation.hour = hour;
    }

    if (minute) {
      annotation.minute = minute;
    }

    if (second) {
      annotation.second = second;
    }

    await annotation.save();
    return annotation.populate("authorId");
  }

  /**
   *
   * Delete a annotation from the collection.
   *
   * @param {string} annotationId - The ID of the annotation to be deleted
   */
  static async deleteOne(annotationId: Types.ObjectId | string): Promise<void> {
    await AnnotationModel.deleteOne({ _id: annotationId });
  }
}

export default AnnotationCollection;
