const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: "a9758cb8b58f4db291f7073d18cfa1b41d9581105d6a2b81e0cda28f3d6a9f36",
        input: { prompt }
      },
      {
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate image.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
