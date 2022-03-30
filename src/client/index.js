import client from './client';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/v1/news', (req, res) => {
  client.getAllNews(null, (error, data) => {
    if (error) return res.status(400).json({ error });
    return res.status(200).json({ result: data.news });
  });
});

app.post('/api/v1/news', (req, res) => {
  const { title, body, imageUrl } = req.body;
  if (!title || !body || !imageUrl)
    return res.status(400).json({ message: 'Fields required' });
  const news = { title, body, imageUrl };
  client.addNews(news, (error, data) => {
    if (error) return res.status(400).json({ error });
    return res.status(200).json({ result: data, message: 'successful' });
  });
});

app.put('/api/v1/news/:newsId', (req, res) => {
  const { title, body, imageUrl } = req.body;
  const { newsId: id } = req.params;
  if (!id) return res.status(400).json({ message: 'Id required' });
  if (!title || !body || !imageUrl)
    return res.status(400).json({ message: 'Body fields required' });
  const news = { id, title, body, imageUrl };
  client.editNews(news, (error, data) => {
    if (error) return res.status(400).json({ error });
    return res.status(200).json({ result: data });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('App server running at port %d...', PORT);
});
