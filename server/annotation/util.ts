import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Annotation, PopulatedAnnotation } from "./model";

type AnnotationResponse = {
  _id: string;
  author: string;
  authorId: string;
  lectureId: string;
  hour: Number;
  minute: Number;
  second: Number;
  content: string;
  dateCreated: string;
};

const constructAnnotationResponse = (annotation: HydratedDocument<Annotation>): AnnotationResponse => {
  const annotationCopy: PopulatedAnnotation = {
    ...annotation.toObject({ versionKey: false }),
  };
  const { name, _id } = annotationCopy.authorId;
  return {
    _id: annotation._id.toString(),
    author: name,
    authorId: _id.toString(),
    lectureId: annotation.lectureId.toString(),
    hour: annotation.hour,
    minute: annotation.minute,
    second: annotation.second,
    content: annotation.content,
    dateCreated: moment(annotation.dateCreated).format("MM/DD/YYYY"),
    // dateCreated: moment(annotation.dateCreated).format("MMMM Do YYYY, h:mm:ss a"),
  };
};

export { constructAnnotationResponse };
