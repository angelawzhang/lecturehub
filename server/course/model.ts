import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import { User } from "server/user/model";

export type Course = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  enrolled: Array<User>;
  active: boolean;
  term: TermLabel;
  year: string;
  instructor: User;
  description: string;
};

export enum TermLabel {
  FallTerm = "FALL",
  SpringTerm = "SPRING",
}

const CourseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  enrolled: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
  },
});

const CourseModel = model<Course>("Course", CourseSchema);
export default CourseModel;
