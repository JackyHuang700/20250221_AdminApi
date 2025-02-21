import { Router } from 'express';

import Paths from './common/Paths';
import UserRoutes from './UserRoutes';
import MongoUserRoutes from './MongoUserRoutes';
import AuthRoutes from './AuthRoutes';


/******************************************************************************
                                Variables
******************************************************************************/

const apiRouter = Router();


// ** Add UserRouter ** //

// Init router
const userRouter = Router();
const mongoUserRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);
userRouter.post(Paths.Users.Login, UserRoutes.login);
userRouter.post(Paths.Users.Logout, UserRoutes.logout);

// Get all users by mongo
mongoUserRouter.get(Paths.MongoUser.Get, AuthRoutes.getAuthVerify, MongoUserRoutes.getAll);
mongoUserRouter.post(Paths.MongoUser.Add, MongoUserRoutes.add);
mongoUserRouter.put(Paths.MongoUser.Update, MongoUserRoutes.update);
mongoUserRouter.delete(Paths.MongoUser.Delete, MongoUserRoutes.delete);
mongoUserRouter.post(Paths.MongoUser.Login, MongoUserRoutes.login);
mongoUserRouter.post(Paths.MongoUser.Logout, MongoUserRoutes.logout);


// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);
apiRouter.use(Paths.MongoUser.Base, mongoUserRouter);


/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;