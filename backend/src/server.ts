import dotenv from "dotenv";
import express, {
    type Application, type NextFunction, type Request, type Response
} from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import categoryRouter from "./routes/category";

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// better-auth
app.all("/api/auth/*splat", toNodeHandler(auth));

// Parsing incoming requests
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

// Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("Hello from the Backend!");
});
app.use("/api/category", categoryRouter);
// Test better-auth
app.get("/api/me", async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    return res.json(session);
});

// global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // Delegate if headers were already sent so Express can finish the response safely.
    if (res.headersSent) {
        return next(err);
    }

    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});