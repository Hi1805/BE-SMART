import { db } from "./connect";
import * as express from "express";
import * as cors from "cors";
import { toString, toNumber } from "lodash";
import { deleteAllAttendance } from "./helpers";
const app = express();
app.use(cors());
app.use(express.json());

const port = 4000;

app.get("/api", async (req, res) => {
  try {
    console.log("run function");

    const { grade } = req.query;
    console.log("class", grade);
    const list = (
      await db.collection("Students").where("class", "==", grade).get()
    ).docs.map((doc) => doc.data());
    // const newList = [];
    // for (const student of list) {
    //   newList.push({
    //     student: student.data(),
    //     attendances: (
    //       await db
    //         .collection("Students")
    //         .doc(student.id)
    //         .collection("attendance")
    //         .where("month", "==", `${month}-${year}`)
    //         .get()
    //     ).docs.map((att) => {
    //       return {
    //         date: att.id,
    //         data: att.data(),
    //       };
    //     }),
    //     uid: student.id,
    //   });
    // }
    // console.log("================== run midlle 3 ================");
    return res.status(200).send(list);
  } catch (error) {
    console.log(error);

    return res.status(401).send({
      message: error,
    });
  }
});
app.listen(port, () => {
  console.log("listening on http://localhost:4000/api");
});
