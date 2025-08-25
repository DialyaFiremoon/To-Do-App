// ------------------- ↓ SETTING UP DEPENDENCIES ↓ -------------------------------

require("dotenv").config(); 
const express = require("express"); // Enables use of Express.js
const cors = require("cors"); // Enables Cross Origin Resource Sharing 
const mongoose = require("mongoose"); // Enables use of Mongo DB


// ------------------- ↓ INITIAL APP CONFIGURATION ↓ -------------------------------

const port = process.env.PORT || 3000;  // Uses port number on device to serve the backend (live  -- the || stands for other. PORT is saved in the .env doc 
const app = express();  // Using Express.js to power the app 



// ------------------- ↓  MIDDLEWARE SETUP  ↓ -------------------------------

app.use(express.json()); // Uses express in JSON form
app.use(cors('*')); // Enables use of CORS - * means every domain is now allowed access to this server to send and receive data - not secure - * is for dev only 

// ------------------- ↓ API ROUTES  ↓ -------------------------------

console.log("hello");

// EXAMPLE

// app.get("/get/example", async (req, res) => {
//     res.send("Hello! I am a message from the backend!!");
// });

// --------------------- ↓ DATABASE CONNECTION ↓ + ↓ APP STARTUP   ↓  -------------------------


(async () => {
    try {

        mongoose.set("autoIndex", false); 

        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected!");

        await Task.syncIndexes();
        console.log("✅ Indexes created!")

        app.listen(port, () => {
    console.log(`To Do App is live on port ${port}`);
});

    } catch (error) {
        console.error("❌ Startup error:", error)        // Start + '.' gives you emoji 
        process.exit(1); // Shutdown the server if there is a Mongoose issue
    }
})(); 

// (() => {})(); // IIFE - Immediately Invoked Function Expression 

// Define the Task Schema (data structure)

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    dueDate: {type: Date, required: true},
    createdOn: {type: Date, default: Date.now, required: true},
    completed: {type: Boolean, required: true, default: false}
}); 

taskSchema.index({ dueDate: 1 });           // essentially adding filters to your MongoDB
taskSchema.index({ dateCreated: 1 });

// Create a "Task" model to be used in the database
const Task = mongoose.model("Task", taskSchema);

// ------------------- ↓ TASK ROUTES  ↓ -------------------------------

// let taskId = 1; 

// const tasks = [
//     {id: taskId++, completed: true, title: "Wash car", description: "My car needs a wash", dueDate: "25/11/2025", createdOn: "11/08/2025" },
//     {id: taskId++, completed: true, title: "Grocery shopping", description: "Make good choices", dueDate: "25/10/2025", createdOn: "11/08/2025" },
//     {id: taskId++, completed: false, title: "Clean heat pump filters", description: "You no longer have a landlord, this is a you job", dueDate: "25/09/2025", createdOn: "11/08/2025" },
//     {id: taskId++, completed: false, title: "Bathe the dogs", description: "They are getting stinky", dueDate: "25/08/2025", createdOn: "11/08/2025" }
// ];



// Get all the tasks

app.get("/tasks", async (req, res) => {
    try {

        const { sortBy } = req.query; // ?sortBy=dueDate or ?sortBy=DateCreated

        let sortOption = {};

        if (sortBy === "dueDate") {
            sortOption = { dueDate: 1 } // 1 is ascending, -1 is descending
        } else if (sortBy === "dateCreated") {
            sortOption = { dateCreated: 1 };
        }

        const tasks = await Task.find({}).sort(sortOption);
        res.json(tasks);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error grabbing tasks!" }); 
    }
}); 



// Create a new task and add it to the array 

app.post("/tasks/todo", async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        const taskData = { title, description, dueDate }; // grabs data 
        const createTask = new Task(taskData); // creates a new "Task" model with the data grabbed 
        const newTask = await createTask.save(); // Save the new task to the database 
        
        res.json({ task: newTask, message: "New task created successfully!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error grabbing tasks!" });        
    }
});


// To complete the task 

app.patch("/tasks/complete/:id", async (req, res) => {
    try {
        const { completed } = req.body;
        const taskId = req.params.id;

        const completedTask = await Task.findByIdAndUpdate(taskId, { completed }, { new: true}); 

        if(!completedTask) {
            return res.status(404).json({ message: "Task not found!" });
        }

        res.json({ task: completedTask, message: "Task set to complete!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error completing the task! "});
    }
});

// To un-complete a task

app.patch("/tasks/notComplete/:id", async (req, res) => {
    try {
        const { completed } = req.body;
        const taskId = req.params.id;

        const taskNotComplete = await Task.findByIdAndUpdate(taskId, { completed }, { new: true }); 

        if(!taskNotComplete) {
            return res.status(404).json({ message: "Task not found!" });
        }

        res.json({ task: taskNotComplete, message: "Task status changed to not complete!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error changing the task to not complete! "});
    }
});


// to delete the task 

app.delete("/tasks/delete/:id", async (req, res) => {
    try {
        
        const taskId = req.params.id;

        const deletedTask = await Task.findByIdAndDelete(taskId);

        if(!deletedTask) {
            return res.status(404).json({ message: "Task not found!" });
        }
        res.json({ task: deletedTask, message: "Task deleted successfully!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error deleting the task!" });
        
    }
});



// To edit the task and change values 

app.put("/tasks/edit/:id", async (req, res) => {
    try {

        const taskId = req.params.id; 

        const { title, description, dueDate } = req.body; 

        const taskData = { title, description, dueDate };

        const editedTask = await Task.findByIdAndUpdate(taskId, taskData, { new: true });
        
        if(!editedTask) {
            return res.status(404).json({ message: "Task not found!" });
        }
        res.json({ task: editedTask, message: "Task edited successfully!" });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error editing the task!" });
    }
});



// HTTP methods: GET POST PATCH PUT DELETE --> CRUD Create Read Update Delete 



