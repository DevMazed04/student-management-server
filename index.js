const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();

const cors = require("cors");
require("dotenv").config();
require("colors");
const port = process.env.PORT || 5000;

/*--- middlewares ---*/
app.use(express.json());
app.use(cors());

/*--- db connection ---*/
// const uri = "mongodb+srv://devmazed:iGgIVELMX1QpR15k@cluster0.evjcfvz.mongodb.net/?retryWrites=true&w=majority";

const uri = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri);

const dbConnect = async () => {
  try {
    await client.connect();
    console.log("Database is connected".bgMagenta);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
};
dbConnect();

/*--- db collections ---*/
const Student = client.db("studentManagement").collection("students");

/*--- operations ---*/

// add a student
app.post("/students", async (req, res) => {
  try {
    // console.log('body before:', req.body)
    const result = await Student.insertOne(req.body);
    //console.log("result:", result);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the student ${req.body.firstName} ${req.body.lastName}  with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Could not create the student",
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find({}).toArray();
    // console.log('students:', students)

    res.send({
      success: true,
      message: "Successfully got the data",
      data: students,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// get a specific student
app.get("/student/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findOne({ _id: new ObjectId(id) });
    console.log("find_student:", student);

    res.send({
      success: true,
      message: `student found ${student.firstName} with id ${id}`,
      data: student,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);

    res.send({
      success: false,
      error: error.message,
    });
  }
});

// update a student
app.patch("/student/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const { firstName } = req.body;
    // console.log(`id for update ${firstName}`, id);

    const result = await Student.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    console.log('result:', result)

    if (result.modifiedCount) {
      res.send({
        success: true,
        message: "Updated Successfully",
      });
    } else {
      res.send({
        success: false,
        error: "Student not updated",
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);

    res.send({
      success: false,
      error: error.message,
    });
  }
});

// delete a student
app.delete("/student/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findOne({ _id: new ObjectId(id) });
    console.log("student:", student);

    if (student?._id) {
      const result = await Student.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount) {
        res.send({
          success: true,
          message: `Student ${student.firstName} ${student.lastName} is deleted successfully`,
        });
      } else {
        res.send({
          success: false,
          error: "Student could not delete",
        });
        console.log("student:", id);
      }
    } else {
      res.send({
        success: false,
        error: "Student is not exists",
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

/*--- listening server ---*/
app.listen(port, () =>
  console.log(`Server is live on port ${port}`.brightYellow.bold)
);
