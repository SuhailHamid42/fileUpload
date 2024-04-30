var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer');

var app = express();

app.use(cors());

const mongoose = require('mongoose');
const MONGO_URI = process.env.URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        // Continue with your application logic
    })
    .catch(err => console.error(err));


const fileSchema = new mongoose.Schema({
    name: String,
    type: String,
    size: Number
});

const Fle = mongoose.model('Fle', fileSchema);

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/uploads'); // Destination directory for uploaded files
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename for uploaded files
  }
});

const upload = multer({ storage: storage });

app.post('/api/fileanalyse', upload.single('upfile'), function(req, res){
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ 
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size 
  });
});





const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
