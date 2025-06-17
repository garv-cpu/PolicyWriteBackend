import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import cron from 'node-cron'; // ✅ import

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: req.body.prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
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

// ✅ CRON JOB to ping itself every 14 minutes
cron.schedule("*/14 * * * *", async () => {
  try {
    const res = await axios.get("https://policywritebackend.onrender.com");
    console.log("Pinged self to keep alive:", res.status);
  } catch (err) {
    console.error("Self-ping failed:", err.message);
  }
});

app.get("/", (req, res) => {
  res.send("Server is alive.");
});

app.listen(PORT, () => {
  console.log("SERVER RUNNING");
});
