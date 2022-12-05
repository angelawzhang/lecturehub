import type { Request, Response } from "express";
import express from "express";
import AnnotationCollection from "./collection";
import * as annotationValidator from "./middleware";
import * as userValidator from "../user/middleware";
import * as util from "./util";
import _ from 'lodash';

const router = express.Router();

/**
 * Get all the annotations associated with a lecture and author
 *
 * @name GET /api/annotation
 *
 * @param {string} lectureId - The ID of the lecture to find annotations for
 * @return {Map<String, Array<UserResponse>>} - Mapping of parent annotation IDs to an array
 * of [parentAnnotation, ...childAnnotations] sorted by creation date.
 * @throws {403} - If user is not logged in
 * @throws {404} - If the lecture ID is not valid
 *
 */
router.get(
  "/",
  [userValidator.isUserLoggedIn, annotationValidator.isValidLectureId],
  async (req: Request, res: Response) => {
    const annotations = (
      await AnnotationCollection.findAllByLectureAndAuthor(req.query.lectureId as string, req.session.userId)
    ).map(util.constructAnnotationResponse);
    console.log("presorted", annotations);
    _.sortBy(annotations, ["hour", "minute", "second"]);
    console.log("sorted", annotations);

    res.status(200).json({
      message: "Annotations successfully retrieved.",
      annotations: annotations,
    });
  }

);

/**
 * Create a new annotation.
 *
 * @name POST /api/annotation
 *
 * @param {string} lectureId - the ID of the lecture
 * @param {Number} hour - The hour of the point in video the annotation correponds to
 * @param {Number} minute - The minute of the point in video the annotation correponds to
 * @param {Number} second - The second of the point in video the annotation correponds to
 * @param {string} content - the content of the annotation
 * @return {AnnotationResponse}
 * @throws {404} - If lecture is not valid
 * @throws {400} - If the content is empty or empty characters
 * @throws {403} - If the user is not logged in
 * @throws {405} - If the parent annotation has a parent
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    annotationValidator.isValidAnnotationContent,
    //TODO: Uncomment when middleware is unblocked
    //annotationValidator.isValidLectureId
    annotationValidator.isValidTime
  ],
  async (req: Request, res: Response) => {
    const annotation = await AnnotationCollection.addOne(
      req.session.userId,
      req.body.lectureId,
      req.body.hour,
      req.body.minute,
      req.body.second,
      req.body.content
    );
    res.status(200).json({
      message: "Successfully created annotation",
      annotation: util.constructAnnotationResponse(annotation),
    });
  }
);

/**
 * Update a annotation
 *
 * @name PATCH /api/annotation/
 *
 * @param {string} annotationId - the ID of the annotation
 * @param {string} content - the updated content of the annotation
 * @param {Number} hour - The hour of the point in video the annotation correponds to
 * @param {Number} minute - The minute of the point in video the annotation correponds to
 * @param {Number} second - The second of the point in video the annotation correponds to
 * @return {AnnotationResponse} - the updated annotation
 * @throws {400} - If the content is empty or empty characters
 * @throws {403} - If the user is not logged in or not the author
 * @throws {404} - If the annotation ID is not valid
 */
router.patch(
  "/:annotationId?",
  [
    userValidator.isUserLoggedIn,
    annotationValidator.isValidAnnotationId,
    annotationValidator.isValidAnnotationContent,
    annotationValidator.isValidTime
  ],
  async (req: Request, res: Response) => {
    const annotation = await AnnotationCollection.updateOne(
      req.params.annotationId,
      req.body.content,
      req.body.hour,
      req.body.minute,
      req.body.second,
    );

    res.status(200).json({
      message: "Annotation was successfully updated!",
      annotation: util.constructAnnotationResponse(annotation),
    });
  }
);

/**
 * Delete an annotation
 *
 * @name DELETE /api/annotation/:annotationId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the annotationId is not valid
 */
 router.delete(
  '/:annotationId?',
  [
    userValidator.isUserLoggedIn,
    annotationValidator.isValidAnnotationId
  ],
  async (req: Request, res: Response) => {
    await AnnotationCollection.deleteOne(req.params.annotationId);
    res.status(200).json({
      message: 'Your annotation was deleted successfully.'
    });
  }
);


export { router as annotationRouter };
