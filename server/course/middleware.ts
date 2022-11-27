import type { Request, Response, NextFunction } from "express";
import UserCollection from "../user/collection";

/**
 * Checks if a name in req.body is valid, that is, it matches the name regex
 */
const isValidName = (req: Request, res: Response, next: NextFunction) => {
  const nameRegex = /^\w+$/i;
  if (!nameRegex.test(req.body.name)) {
    res.status(400).json({
      error: "Name must be a nonempty alphanumeric string.",
    });
    return;
  }
  next();
};

/**
 * Checks if current user is an instructor
 */
const isInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await UserCollection.findOneByUserId(
    req.session.userId as string
  );
  if (user.isStudent) {
    res.status(403).json({
      error: `The user is not an instructor and doesn't have permissions to complete this action.`,
    });
  }
  next();
};

export { isValidName, isInstructor };
