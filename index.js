
const express = require("express");
const app = express();
const dotenv = require("dotenv");

const mongoose = require("mongoose");

const TodoTask = require("./models/TodoTask");


dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

async function run() {
    await mongoose.connect(process.env.DB_CONNECT, {});
    console.log(mongoose.connection.readyState);
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
  }
  run();

app.set("view engine", "ejs");
 

// GET METHOD
app.get("/", async (req, res) => {
    try {
      const tasks = await TodoTask.find({});
      res.render("todo.ejs", { todoTasks: tasks });
    } catch (err) {
      console.log(err);
    }
  });

// POST METHOD
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    try {
    await todoTask.save();
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });

    // upd
    app.route("/edit/:id")
    .get(async (req, res) => {
      const id = req.params.id;
      try {
        const tasks = await TodoTask.find({});
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
      } catch (err) {
        console.log(err);
      }
    });
    app.route("/edit/:id")
.post(async (req, res) => {
  const id = req.params.id;
  try {
    await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send(500, err);
  }
});


//delete
app.route("/remove/:id").get(async (req, res) => {
    const id = req.params.id;
    try {
      await TodoTask.findByIdAndDelete(id);
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.send(500, err);
    }
  });