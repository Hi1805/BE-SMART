import { db } from "./connect";
import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = 4000;

app.get("/api", async (req, res) => {
  try {
    const { year, month } = req.query;
    const list = (await db.collection("Students").get()).docs.map(
      async (student) => {
        const attendances = (
          await db
            .collection("Students")
            .doc(student.id)
            .collection("attendance")
            .where("month", "==", `${month}-${year}`)
            .get()
        ).docs.map((item) => ({
          date: item.id,
          data: item.data(),
        }));
        return {
          student: student.data(),
          attendances,
          uid: student.id,
        };
      }
    );
    const responseList = await Promise.all(list);
    return res.status(200).send(responseList);
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      message: error,
    });
  }
});
app.listen(process.env.PORT || port, () => {
  console.log("listening on http://localhost:4000/api");
});
