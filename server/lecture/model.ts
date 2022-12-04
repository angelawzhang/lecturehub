import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import { Course } from "../course/model";

export type Lecture = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  course: Course;
  date: Date;
  src: string;
};

const LectureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
});

const LectureModel = model<Lecture>("Lecture", LectureSchema);
export default LectureModel;
