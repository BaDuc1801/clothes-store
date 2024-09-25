import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import itemRouter from './routes/itemRouter.js';
import userRouter from './routes/userRouter.js';

await mongoose.connect('mongodb+srv://minhduc180104:minhduc180104@learnmongo.zli6q.mongodb.net/store?retryWrites=true&w=majority&appName=LearnMongo')

const app = express();
app.use(express.json());
app.use(cors());

app.use('/items', itemRouter)
app.use('/users', userRouter)

app.listen(8080, () => {
    console.log("Server is running")
})