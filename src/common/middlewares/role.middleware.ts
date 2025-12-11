import { NextFunction, Response } from "express";
import { ReqUser } from "../../modules/auth/auth.dto";
const roleGuard = (roles: string) => {
  return (req: ReqUser, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    console.log(roles)
    if (!role || !roles.includes(role)) {
      console.log(roles)
      console.log("Error di roleGuard middleware");
      return res.status(403).json({
        message: "forbidden",
        data: null,
      });
    }

    next();
  };
};

// const showRole = (roles: string) => {
//   return (req: ReqUser, res: Response, next: NextFunction) => {
//   console.log(roles);
//   console.log("showRole middleware");
//     console.log(req.user);
//     if (!req.user?.role) {
//       return res.status(403).json({
//         message: "jalan",
//         data: null,
//       });
//     }
//     next();
//   };
// };

export default roleGuard;
