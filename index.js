const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://sasikalai2109:1vEWRLwqH6vu6MCw@cluster0.5q1yupg.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a schema for feedback data
const feedbackSchema = new mongoose.Schema({
  
  courseName: String,
  paperName: String,
  instructorName: String,
  studentName: String,
  batchNumber: String,
  ratings: [
    {
      topics:String,
      rating:Number
    }
  ],
  courseExpectation: String,
  courseImprovement: String,
  additionalComments: String,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

app.post('/submit-feedback', async (req, res) => {
  const formData = req.body;

  try {
    const feedback = new Feedback({
      courseName: formData.courseName,
      paperName: formData.paperName,
      instructorName: formData.instructorName,
      studentName: formData.studentName,
      batchNumber: formData.batchNumber,
      ratings: formData.ratings.map((rating, index) => ({
        topic: topics[index], // Assuming 'topics' is defined somewhere in your code
        ratings,
      })),
      courseExpectation: formData.courseExpectation,
      courseImprovement: formData.courseImprovement,
      additionalComments: formData.additionalComments,
    });

    await feedback.save();
    console.log('Feedback saved:', feedback);
    res.status(200).send('Feedback received and stored successfully');
  } catch (error) {
    console.error('Error storing feedback:', error);
    res.status(500).send('Internal server error');
  }
});
app.get('/get-feedback', async (req, res) => {
  try {
    const feedbackData = await Feedback.find();
    res.json(feedbackData);
  } catch (error) {
    console.error('Error fetching feedback data:', error);
    res.status(500).send('Internal server error');
  }
});

app.delete('/delete-feedback/:id', async (req, res) => {
  const feedbackId = req.params.id;

  try {
    await Feedback.findByIdAndDelete(feedbackId);
    console.log('Feedback deleted:', feedbackId);
    res.status(200).send('Feedback deleted successfully');
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).send('Internal server error');
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
