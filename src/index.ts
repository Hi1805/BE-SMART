import { db } from "./connect";
import { getWeekNow } from "./helpers";
const CronJob = require("cron").CronJob;

const updateSchedule = async () => {
  const template = {
    morning: [],
    afternoon: [],
    status: true,
    asked: "",
    note: "",
  };
  try {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const maxDay = new Date(year, month, 0).getDate();
    await db
      .collection("Students")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          for (let i = 1; i <= maxDay; i++) {
            if (i < 10) {
              db.collection("Students2")
                .doc(doc.id)
                .collection("attendance")
                .doc(`${month}-0${i}-${year}`)
                .set({
                  ...template,
                  week: getWeekNow(),
                  status: false,
                  asked: true,
                  note: "",
                })
                .then(() => {
                  console.log("update student ID", doc.id);
                })
                .catch((error) => {
                  console.log(error);
                });
            } else {
              db.collection("Students2")
                .doc(doc.id)
                .collection("attendance")
                .doc(`${month}-${i}-${year}`)
                .set({
                  ...template,
                  week: getWeekNow(),
                  status: true,
                  asked: true,
                  note: "",
                })
                .then(() => {
                  console.log("update student ID", doc.id);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          }
        });
      });
  } catch (error) {
    console.log(error);
  }
};

const job = new CronJob(
  "0 0 1 * *",
  function () {
    console.log("You will see this message every second");
  },
  null,
  false,
  "America/Los_Angeles"
);
job.start();
