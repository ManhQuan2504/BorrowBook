const express = require("express");
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const routes = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer'); 
const YAML = require('yaml');
const fs = require("fs");
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const viewEngine = require('./viewEngine');

const file = fs.readFileSync(path.resolve(__dirname, 'OBERIswagger.yaml'), 'utf8');
const swaggerDocument = YAML.parse(file);

const app = express();
const port = process.env.PORT || 3002;

// const corsOptions = {
//     origin: process.env.URL_REACT, // Replace with your Vercel frontend URL
//     credentials: true,  // Enable credentials (cookies, authorization headers, etc.)
//   };
//   app.options('*',cors())
  app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(upload.single('image'));

const swaggerUrl = '/api-docs'; // Điều này có thể thay đổi thành URL tùy chỉnh của bạn
app.use(swaggerUrl, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

viewEngine(app);
routes(app);
app.use(express.static(path.join(__dirname, '..', 'node_modules/swagger-ui-dist'), { index: false }));
mongoose.set('strictQuery', false)
mongoose.connect(`${process.env.MONGO_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connect MongoDB success!')
        app.listen(port, () => {
            console.log('Server is running in port: ', + port)
        })
    })
    .catch((err) => {
        console.log(err)
    });
