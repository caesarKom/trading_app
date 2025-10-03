import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateSocketUser from './middleware/socketAuth.js';
import cors from 'cors';
import connectDB from './config/connect.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRouter from './routes/auth.js';
import stockRouter from './routes/stocks.js';
import {
  generateRandomDataEveryFiveSecond,
  scheduleDayReset,
  updateTenMinutesCandle,
} from './services/cronJob.js';
import { Server } from 'socket.io';
import socketHandshake from './middleware/socketHandshake.js';
import Stock from './models/Stock.js';

dotenv.config();

// Cron
scheduleDayReset();
generateRandomDataEveryFiveSecond();
updateTenMinutesCandle();

const holidays = ['2025-10-01', '2025-10-30'];

const isTradingHour = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
  const isWeekday = dayOfWeek > 0 && dayOfWeek < 6; // Monday to Friday

  const isTradingTime =
    (now.getHours() === 9 && now.getMinutes() >= 30) ||
    (now.getHours() > 9 && now.getHours() < 15) ||
    (now.getHours() === 15 && now.getMinutes() <= 30);
  // 9:30 AM to 3:30 PM
  const today = new Date().toISOString().slice(0, 10);
  const isTradingHour = isWeekday && isTradingTime && !holidays.includes(today);
  return isTradingHour;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.WEBSERVER_URI || 'http://localhost:8001',
    methods: ['GET', 'POST'],
    allowedHeaders: ['access_token'],
    credentials: true,
  },
});
io.use(socketHandshake);

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('subscribeToStocks', async (stockSymbol) => {
    console.log(`Client ${socket.id} subscribed to stock: ${stockSymbol}`);

    const sendUpdates = async () => {
      try {
        const stock = await Stock.findOne({ symbol: stockSymbol });
        if (!stock) {
          console.error(`Stock with symbol ${stockSymbol} not found.`);
          return;
        } else {
          socket.emit(`${stockSymbol}`, stock);
        }
      } catch (error) {
        console.error('Error sending stock update', error);
      }
    };

    sendUpdates();

    const intervalId = setInterval(sendUpdates, 5000);

    if (!isTradingHour()) {
      clearInterval(intervalId);
    }
  });

  socket.on('subscribeToMultipleStocks', async (stockSymbol) => {
    console.log(`Client ${socket.id} subscribed to multiple stock: ${stockSymbol}`);

    const sendUpdates = async () => {
      try {
          const stock = await Stock.find({ symbol: {$in: stockSymbol} });
          const stockData = stock.map((stock) => ({
            symbol: stock.symbol,
            currentPrice: stock.currentPrice,
            lastDayTradedPrice: stock.lastDayTradedPrice
          }))

          socket.emit('multipleStocksData', stockData)
     
      } catch (error) {
        console.error('Error sending stock update:', error);
      }
    };

    sendUpdates();

    const intervalId = setInterval(sendUpdates, 5000);

    if (!isTradingHour()) {
      clearInterval(intervalId);
    }
  });

  socket.on('disconnect', () => {
    console.log('A Client disconnected');
  });
});

// Log WebSocket server status
httpServer.listen(process.env.SOCKET_PORT || 4000, () => {
  console.log(
    '\nWebSocket server is running on port',
    httpServer.address().port
  );
});

app.get('/', (req, res) => {
  res.send(`<h1>Trading API</h1><a href="/api-docs">Documentation</a>`);
});

const swaggerDocument = YAML.load(join(__dirname, './docs/swagger.yaml'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Routes
app.use('/auth', authRouter);
app.use('/stocks',authenticateSocketUser, stockRouter);

app.use(cors());
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
