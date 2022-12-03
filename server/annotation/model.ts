import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import { User } from "server/user/model";

export type Annotation = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  lectureId: Types.ObjectId;
  hour: Number;
  minute: Number;
  second: Number;
  content: string;
  dateCreated: Date;
};

export type PopulatedAnnotation = {
  _id: Types.ObjectId;
  authorId: User;
  lectureId: Types.ObjectId;
  parentId: Types.ObjectId;
  hour: Number;
  minute: Number;
  second: Number;
  content: string;
  dateCreated: Date;
};

const AnnotationSchema = new Schema<Annotation>({
  // The author userId
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The lecture ID
  lectureId: { type: Schema.Types.ObjectId, required: true, ref: "Lecture" },
  hour: {
    type: Number,
    required: true,
  },
  minute: {
    type: Number,
    required: true,
  },
  second: {
    type: Number,
    required: true,
  },
  // The content of the annotation
  content: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
});

const AnnotationModel = model<Annotation>("Annotation", AnnotationSchema);
export default AnnotationModel;
