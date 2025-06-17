import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
dotenv.config();

const app = express();
const PORT = process.env.PORT
const API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct", // ✅ valid model ID
          messages: [{ role: "user", content: req.body.prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // ✅ using .env key
            "Content-Type": "application/json",
          },
        }
      );
      res.send(response.data.choices[0].message.content);
    } catch (err) {
      console.error(err.response?.data || err.message);
      res.status(500).send("Error generating policy");
    }
  });  

app.listen(PORT, () => {
    console.log("SERVER RUNNING")
})