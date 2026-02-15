import express from 'express';
import sessionLogRouter from './routes/sessionLogRouter.js'

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static('frontend'));
app.use(express.json());

app.use("/api/", sessionLogRouter);

app.listen(PORT, () => {
  console.log("Server running in port ", PORT);
})