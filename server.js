import express from 'express';
import { faker } from '@faker-js/faker';
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 3000;

function generateUnreadMessages(count = 5) {
  const messages = [];

  for (let i = 0; i < count; i++) {
    messages.push({
      id: faker.string.uuid(),
      from: faker.internet.email(),
      subject: faker.lorem.words(3),
      body: faker.lorem.paragraph(),
      recieved: faker.date.recent({ days: 7 }).getTime(),
    });
  }
  return messages;
}

app.use(cors({
  origin: [    
    'https://alexbog1985.github.io',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
  ],
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.get('/messages/unread', (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const count = Math.floor(Math.random() * 10) + 1;
    const unreadMessages = generateUnreadMessages(count);

    const response = {
      status: 'ok',
      timestamp: Date.now(),
      messages: unreadMessages,
    };

    res.json(response);

  } catch (error) {
    console.error('Ошибка обработки запроса', error);

    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Основной эндпойнт: http://localhost:${PORT}/messages/unread`);
});
