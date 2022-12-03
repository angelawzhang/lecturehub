import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Post, PopulatedPost } from "./model";

type PostResponse = {
  _id: string;
  author: string;
  authorId: string;
  lectureId: string;
  parentId: string | null;
  content: string;
  dateCreated: string;
};

const constructPostResponse = (post: HydratedDocument<Post>): PostResponse => {
  const postCopy: PopulatedPost = {
    ...post.toObject({ versionKey: false }),
  };
  const { name, _id } = postCopy.authorId;
  return {
    _id: post._id.toString(),
    author: name,
    authorId: _id.toString(),
    lectureId: post.lectureId.toString(),
    parentId: post.parentId ? post.parentId.toString() : null,
    content: post.content,
    dateCreated: moment(post.dateCreated).format("MMMM Do YYYY, h:mm:ss a"),
  };
};

export { constructPostResponse };
