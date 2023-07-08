const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoutes = require('./routes/productRoute');
const paymentRoute = require('./routes/paymentRoute')
const cors = require('cors');
// config env
dotenv.config();

// database cofig
connectDB();

// rest object
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoutes); 
app.use("/api/v1/payments", paymentRoute)


// rest api
app.get('/', (req, res) => {
    res.send(`<h1>88*</h1>`)
})

const PORT = process.env.PORT || 8096;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})  