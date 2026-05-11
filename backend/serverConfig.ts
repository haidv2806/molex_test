import express from "express";
import rateLimit from "express-rate-limit";
import http from "http";
import cors from "cors";
import helmet from 'helmet';

const app = express();
const server = http.createServer(app);

// 1. Trust Proxy - Phải đặt trên cùng nếu chạy sau Nginx/Cloudflare
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

// 2. Helmet - Bảo mật header
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "connect-src": [
        "'self'",
        `${process.env.CLIENT_URL}`,
        `${process.env.HOST}`,
      ],
      "img-src": ["'self'", "data:", "https:", "http:"],
      "script-src": ["'self'"],
    },
  },
}));

// 3. CORS
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // App Mobile thường không có origin, cho phép luôn
    if (!origin || origin === 'null') return callback(null, true);

    // Nếu có origin (từ Web), kiểm tra whitelist
    const allowed = [process.env.CLIENT_URL, "http://localhost:5173"];
    if (allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// 4. Các middleware parse dữ liệu
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Rate Limit
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

export { server, app };