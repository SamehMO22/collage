// import { initiaApp } from "./src/utiles/initiatapp.js";
import express from 'express'

import { config } from "dotenv";
import path from 'path';

// config({path:'../pro/config'})
config({ path: path.resolve('config/.env')})
import initiaApp from './src/utiles/initiatapp.js';

const app = express()

initiaApp(app , express)