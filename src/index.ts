import { db } from "./connect";
import * as express from "express";
import * as cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

const port = 4000;

app.get("/api", async (req, res) => {
  try {
    const list = (await db.collection("Students").get()).docs;
    const newList = [];
    for (const student of list) {
      newList.push({
        student: student.data(),
        attendances: (
          await db
            .collection("Students")
            .doc(student.id)
            .collection("attendance")
            .get()
        ).docs.map((att) => {
          return {
            date: att.id,
            data: att.data(),
          };
        }),
        uid: student.id,
      });
    }
    const newList2 = await Promise.all(newList);
    return res.status(200).send(newList2.slice(0, 5));
  } catch (error) {
    return res.status(401).send("errror");
  }
});
app.listen(port, () => {
  console.log("listening on http://localhost:4000/api");
});
