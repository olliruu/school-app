import express from "express";
import mysql from 'mysql';
import cors from 'cors';
import expressWs from 'express-ws';
import router, {prepareWs} from './routes/main.js';

const port = 4000
const app = express();
const wss = expressWs(app);
prepareWs();

app.use(cors());
app.use(express.json());

app.use((req,res, next)=>{
	//middleware for logging requests
	console.log(`route: ${req.url}`);
	next();
});

app.use("/api", router);

app.listen(port, ()=>{
	console.log(`server running on port ${port}`);
});
