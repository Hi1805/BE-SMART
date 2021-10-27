import { db } from "./connect";
import * as express from "express";
import * as cors from "cors";
import { updateSchedule } from "./cronjob";
const app = express();
app.use(cors());
app.use(express.json());

const CronJob = require("cron").CronJob;
const job = new CronJob(
  "0 0 1 * *",
  updateSchedule,
  null,
  true,
  "America/Los_Angeles"
);
job.start();

const port = 4000;

app.get("/api", async (req, res) => {
  try {
    const listStudent = (await db.collection("Students").get()).docs.map(
      async (response) => {
        const student = response.data();

        const attendances = (
          await db
            .collection("Students")
            .doc(response.id)
            .collection("attendance")
            .get()
        ).docs.map((att) => {
          return {
            date: att.id,
            data: att.data(),
          };
        });
        return {
          ...student,
          attendances,
          uid: student.id,
        };
      }
    );
    const newList = await Promise.all(listStudent);
    return res.status(200).send(newList);
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log("listening on http://localhost:4000/api" + port);
});
