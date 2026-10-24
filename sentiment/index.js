require('dotenv').config();
const express = require('express');
const natural = require('natural');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/sentiment', (req, res) => {
  const { sentence } = req.body || {};

  if (!sentence || typeof sentence !== 'string') {
    return res.status(400).json({ error: 'No sentence provided' });
  }

  try {
    const analyzer = new natural.SentimentAnalyzer(
      'English', natural.PorterStemmer, 'afinn'
    );
    const analysisResult = analyzer.getSentiment(sentence.split(/\s+/));
    let sentiment = 'neutral';

    if (analysisResult > 0) sentiment = 'positive';
    else if (analysisResult < 0) sentiment = 'negative';

    return res.status(200).json({
      sentimentScore: analysisResult,
      sentiment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error performing sentiment analysis'
    });
  }
});

app.listen(port, () => {
  console.log(`Sentiment service running on port ${port}`);
});
