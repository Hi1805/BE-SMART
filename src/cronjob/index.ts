import { db } from "../connect";
import { getWeekNow } from "../helpers";

export const updateSchedule = async () => {
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
          for (let day = 1; day <= maxDay; day++) {
            const formatMonth = month >= 10 ? month.toString() : `0${month}`;
            const newDate =
              day < 10
                ? `${formatMonth}-0${day}-${year}`
                : `${formatMonth}-${day}-${year}`;
            db.collection("Students")
              .doc(doc.id)
              .collection("attendance")
              .doc(newDate)
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
          }
        });
      });
  } catch (error) {
    console.log(error);
  }
};
