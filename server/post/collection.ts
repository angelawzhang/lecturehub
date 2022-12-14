import type { HydratedDocument, Types } from "mongoose";
import type { Post } from "./model";
import PostModel from "./model";

class PostCollection {
  /**
   * Add a Post to the collection
   *
   * @param {string} authorId - The id of the author
   * @param {string} lectureId - The id of the parent lecture
   * @param {string | null} parentId - The id of the parent post,
   * null if there is no parent post
   * @param {string} content - The content of the post
   * @returns {Promise<HydratedDocument<Post>>} - The created Post
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    lectureId: Types.ObjectId | string,
    parentId: Types.ObjectId | string | null = null,
    content: string
  ): Promise<HydratedDocument<Post>> {
    const date = new Date();
    const post = new PostModel({
      authorId: authorId,
      lectureId: lectureId,
      parentId: parentId,
      content: content,
      dateCreated: date,
    });

    await post.save();
    return post.populate("authorId");
  }

  /**
   *
   * Find all posts with a given parent lecture with lectureId.
   *
   * @param {string} lectureId - The ID of the parent lecture
   * @returns {Promise<Array<HydratedDocument<Post>>>} - An array of matching posts
   */
  static async findAllByLecture(
    lectureId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Post>>> {
    return PostModel.find({ lectureId: lectureId })
      .sort("-date")
      .populate("authorId");
  }

  /**
   *
   * Find all posts associated with a user with userId.
   *
   * @param {string} userId - The ID of the parent lecture
   * @returns {Promise<Array<HydratedDocument<Post>>>} - An array of matching posts
   */
  static async findAllByUser(
    userId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Post>>> {
    return PostModel.find({ authorId: userId });
  }

  /**
   *
   * Updates a post in the collection
   *
   * @param {string} postId - The ID of the post to be updated
   * @param {string} content - The new content of the post
   * @returns {Promise<HydratedDocument<Post>>} - The updated post
   */
  static async updateOne(
    postId: Types.ObjectId | string,
    content: string
  ): Promise<HydratedDocument<Post>> {
    const post = await PostModel.findById(postId);
    post.content = content;
    await post.save();
    return post.populate("authorId");
  }

  /**
   *
   * Delete a post from the collection.
   *
   * @param {string} postId - The ID of the post to be deleted
   */
  static async deleteOne(postId: Types.ObjectId | string): Promise<void> {
    await PostModel.deleteOne({ _id: postId });
  }
}

export default PostCollection;
