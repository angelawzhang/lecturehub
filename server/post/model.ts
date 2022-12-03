import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import { User } from "server/user/model";

export type Post = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  lectureId: Types.ObjectId;
  parentId: Types.ObjectId;
  content: string;
  dateCreated: Date;
};

export type PopulatedPost = {
  _id: Types.ObjectId;
  authorId: User;
  lectureId: Types.ObjectId;
  parentId: Types.ObjectId;
  content: string;
  dateCreated: Date;
};

const PostSchema = new Schema<Post>({
  // The author userId
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The lecture ID
  lectureId: { type: Schema.Types.ObjectId, required: true, ref: "Lecture" },
  // Post ID of the parent
  parentId: {
    type: Schema.Types.ObjectId,

    default: null,
    ref: "Post",
  },
  // The content of the post
  content: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
});

const PostModel = model<Post>("Post", PostSchema);
export default PostModel;
