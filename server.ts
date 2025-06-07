import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import * as Middlewares from "./src/middlewares";
import * as Routers from "./src/routers";
import * as Constants from "./src/globals/constants";

const app = express();

// Middlewares
app
  .use(cors())
  .use(helmet())
  .use(morgan("dev"))
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

// Routers
app.use(`${Constants.System.ROOT}/`, Routers.Health);
app.use(`${Constants.System.ROOT}/auth`, Routers.Auth);
app.use(`${Constants.System.ROOT}/users`, Routers.User);
app.use(`${Constants.System.ROOT}/announcements`, Routers.Announcement);
app.use(`${Constants.System.ROOT}/answers`, Routers.Answer);
app.use(`${Constants.System.ROOT}/questions`, Routers.Question);
app.use(`${Constants.System.ROOT}/courses`, Routers.Course);
app.use(`${Constants.System.ROOT}/enrollments`, Routers.Enrollment);
app.use(`${Constants.System.ROOT}/sessions`, Routers.Session);
app.use(`${Constants.System.ROOT}/timetables`, Routers.TimeTable);

// Error Handlers
app.use(Middlewares.Error.errorHandler);

app.listen(Constants.System.PORT, () => {
  console.log(`Server started on port ${Constants.System.PORT}`);
});
