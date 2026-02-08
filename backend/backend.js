import express from 'express';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static('frontend'));

app.listen(PORT, () => {
  console.log("Server running in port ", PORT);
})