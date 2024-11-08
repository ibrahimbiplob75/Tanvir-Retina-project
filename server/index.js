const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const xlsx = require('xlsx');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());


const client = new MongoClient(process.env.DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function getCollections() {
  try {
    const db = client.db("studentResults");
    const resultsCollection = db.collection("results");
    return { resultsCollection };
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}


const upload = multer({ dest: 'uploads/' });


app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const filePath = req.file.path;
  try {
    const { resultsCollection } = await getCollections();
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    await resultsCollection.insertMany(jsonData);
    res.send("File uploaded and data stored successfully");
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send("Failed to process file");
  } finally {
    fs.unlinkSync(filePath); // Clean up uploaded file
  }
});

// Route to get basic student info
app.get("/basic-info", async (req, res) => {
  const { Roll, Mobile } = req.query;
  if (!Roll || !Mobile) {
    return res.status(400).json({ message: "Roll and Mobile number are required" });
  }

  try {
    const { resultsCollection } = await getCollections();
    const query = {
      Roll: parseInt(Roll),
      $or: [{ Student: Mobile }, { Guardian: Mobile }],
    };

    const studentData = await resultsCollection.findOne(query, {
      projection: { _id: 0, Name: 1, Roll: 1, Batch: 1 },
    });
    studentData
      ? res.status(200).json(studentData)
      : res.status(404).json({ message: "Student not found" });
  } catch (error) {
    console.error("Error retrieving basic info:", error);
    res.status(500).json({ message: "Error retrieving data" });
  }
});


app.get('/results', async (req, res) => {
  const { Roll, Mobile } = req.query;
  const teacherCode = "+88017777777"; // Replace this with the actual teacher code

  try {
    const { resultsCollection } = await getCollections();
    
    // Step 1: Check if any document matches the given Roll and Mobile or if Mobile is the teacher code
    const mobileMatch = await resultsCollection.findOne({
      Roll: parseInt(Roll),
      $or: [{ Student: Mobile }, { Guardian: Mobile }, { Teacher_code: teacherCode }]
    });

    // Step 2: If a match is found, retrieve all documents with the given Roll
    if (mobileMatch || Mobile === teacherCode) {
      const results = await resultsCollection.find({ Roll: parseInt(Roll) }).toArray();
      res.json(results);
    } else {
      // If no match found, return an empty array
      res.json([]);
    }

  } catch (error) {
    console.error("Error retrieving results:", error);
    res.status(500).send("Failed to retrieve results");
  }
});





app.get('/admin/results/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { resultsCollection } = await getCollections();
    const result = await resultsCollection.findOne({ _id: new ObjectId(id) });
    result
      ? res.status(200).json(result)
      : res.status(404).json({ message: 'Result not found' });
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.put('/admin/results/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  delete updatedData._id; 
  try {
    const { resultsCollection } = await getCollections();
    const updateResult = await resultsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    updateResult.matchedCount
      ? res.status(200).json({ message: 'Result updated successfully' })
      : res.status(404).json({ message: 'Result not found' });
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/admin/results', async (req, res) => {
  try {
    const { resultsCollection } = await getCollections();
    const results = await resultsCollection.find().toArray();
    res.send(results);
  } catch (error) {
    console.error("Error retrieving all results:", error);
    res.status(500).json({ message: "Failed to retrieve results" });
  }
});


app.delete("/admin/results/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { resultsCollection } = await getCollections();
    const deleteResult = await resultsCollection.deleteOne({ _id: new ObjectId(id) });
    deleteResult.deletedCount
      ? res.json({ message: "Result deleted successfully" })
      : res.status(404).json({ message: "Result not found" });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ message: "Failed to delete result" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
