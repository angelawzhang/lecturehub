import type { Request, Response } from "express";
import express from "express";
import PostCollection from "./collection";
import * as postValidator from "./middleware";
import * as userValidator from "../user/middleware";
import * as util from "./util";

const router = express.Router();

/**
 * Get all the posts associated with a lecture
 *
 * @name GET /api/post
 *
 * @param {string} lectureId - The ID of the lecture to find posts for
 * @return {Map<String, Array<UserResponse>>} - Mapping of parent post IDs to an array
 * of [parentPost, ...childPosts] sorted by creation date.
 * @throws {403} - If user is not logged in
 * @throws {404} - If the lecture ID is not valid
 *
 */
router.get(
  "/",
  // TODO: Uncomment when middleware is unblocked
  // [userValidator.isUserLoggedIn, postValidator.isValidLectureId],
  async (req: Request, res: Response) => {
    const posts = (
      await PostCollection.findAllByLecture(req.query.lectureId as string)
    ).map(util.constructPostResponse);
    const postMapping = new Map();
    posts
      .filter((post) => post.parentId === null)
      .map((post) => {
        postMapping.set(
          post._id,
          [post].concat(
            posts.filter((childPost) => childPost.parentId === post._id)
          )
        );
      });

    const response = Object.fromEntries(postMapping);
    res.status(200).json({
      message: "Posts successfully retrieved.",
      posts: response,
    });
  }
);

/**
 * Create a new post.
 *
 * @name POST /api/post
 *
 * @param {string} lectureId - the ID of the lecture
 * @param {string | null}  parentId - the ID of the parent post
 * @param {string} content - the content of the post
 * @return {PostResponse}
 * @throws {404} - If lecture or parent ID is not valid
 * @throws {400} - If the content is empty or empty characters
 * @throws {403} - If the user is not logged in
 * @throws {405} - If the parent post has a parent
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    postValidator.isValidParentPostId,
    postValidator.isValidParentPost,
    postValidator.isValidPostContent,
    //TODO: Uncomment when middleware is unblocked
    //postValidator.isValidLectureId
  ],
  async (req: Request, res: Response) => {
    const post = await PostCollection.addOne(
      req.session.userId,
      req.body.lectureId,
      req.body.parentId,
      req.body.content
    );
    res.status(200).json({
      message: "Successfully created post",
      post: util.constructPostResponse(post),
    });
  }
);

/**
 * Update a post
 *
 * @name PATCH /api/post
 *
 * @param {string} postId - the ID of the post
 * @param {string} content - the updated content of the post
 * @return {PostResponse} - the updated post
 * @throws {400} - If the content is empty or empty characters
 * @throws {403} - If the user is not logged in or not the author
 * @throws {404} - If the post ID is not valid
 */
router.patch(
  "/",
  [
    userValidator.isUserLoggedIn,
    postValidator.isValidPostId,
    postValidator.isValidPostContent,
    postValidator.isValidPostModifier,
  ],
  async (req: Request, res: Response) => {
    const post = await PostCollection.updateOne(
      req.body.postId,
      req.body.content
    );

    res.status(200).json({
      message: "Post was successfully updated!",
      post: util.constructPostResponse(post),
    });
  }
);

/**
 * Deletes a post
 *
 * @name DELETE /api/post
 *
 * @param {string} postId - the ID of the post
 * @throws {403} - If the user is not logged in or not the author
 * @throws {404} - If the post ID is not valid
 */
router.delete(
  "/",
  [
    userValidator.isUserLoggedIn,
    postValidator.isValidPostId,
    postValidator.isValidPostModifier,
  ],
  async (req: Request, res: Response) => {
    const postId = req.body.postId;
    await PostCollection.deleteOne(postId);
    res.status(200).json({
      message: "Post successfully deleted",
    });
  }
);

export { router as postRouter };
