import type { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import PostCollection from "./collection";
import PostModel from "./model";

/**
 * Checks if the lecture ID is a valid lecture
 */
const isValidLectureId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validLecture = req.query.lectureId
    ? isValidObjectId(req.query.lectureId)
    : isValidObjectId(req.body.lectureId);
  const lectureId = req.query.lectureId
    ? req.query.lectureId
    : req.body.lectureId;
  console.log(validLecture, lectureId);
  // TODO: implement when LectureModel is added.
  // const post = validLecture ? await LectureModel.findById(lectureId) : "";
  // if (!post) {
  //   res.status(404).json({
  //     error: "Lecture ID is not valid",
  //   });
  //   return;
  // }
  next();
};

/**
 * Checks if the post ID is a valid post
 */
const isValidPostId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validPost = isValidObjectId(req.body.postId);
  const post = validPost ? await PostModel.findById(req.body.postId) : "";
  if (!post) {
    res.status(404).json({
      error: "Post ID is not valid",
    });
    return;
  }
  next();
};

/**
 * Checks if the parent post ID is a valid post
 */
const isValidParentPostId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // no post ID to check
  if (req.body.parentId === null || req.body.parentId === undefined) {
    next();
    return;
  }
  const validPost = isValidObjectId(req.body.parentId);
  const post = validPost ? await PostModel.findById(req.body.parentId) : "";
  if (!post) {
    res.status(404).json({
      error: "The post ID is not valid",
    });
    return;
  }

  next();
};

/**
 * Checks if the parent post is actually a parent post, and not
 * a child post
 */
const isValidParentPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.parentId === null || req.body.parentId === undefined) {
    next();
    return;
  }
  const post = await PostModel.findById(req.body.parentId);
  console.log("POST", post);
  if (post.parentId !== null) {
    res.status(405).json({
      error: "Cannot create a child post on a non parent post",
    });
    return;
  }
  next();
};

/**
 * Checks if the content of the post is not empty
 * and not a series of whitespace
 */
const isValidPostContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.content) {
    res.status(400).json({
      error: "No content provided",
    });
    return;
  } else if (!req.body.content.trim()) {
    res.status(400).json({
      error: "Content cannot be empty",
    });
    return;
  }

  next();
};

/**
 * Checks if the logged in user is the same as the
 * original post author
 */
const isValidPostModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const post = await PostModel.findById(req.body.postId);
  if ((req.session.userId as string) !== post.authorId.toString()) {
    res.status(403).json({
      error: "Invalid post modifier",
    });
    return;
  }
  next();
};

export {
  isValidLectureId,
  isValidPostId,
  isValidParentPostId,
  isValidParentPost,
  isValidPostContent,
  isValidPostModifier,
};
