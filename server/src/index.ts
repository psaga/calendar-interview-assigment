import * as express from "express";
import * as bodyParser from "body-parser";
import { connect } from "./database/db";
import usersApi from './api/users';
import slotsApi from "./api/slots";
import * as cors from "cors";
import { config } from "./config";

const mongoose = require('mongoose');

(async function() {
  await connect(mongoose);
  
  const app = express();
  
  app.use(cors());
  // Parse text
  app.use(bodyParser.text());

  // Parse application/json
  app.use(bodyParser.json());
    
  app.use(`${config.apiPath}/users`, usersApi);

  app.use(`${config.apiPath}/slots`, slotsApi);

  app.listen(config.port, async () => {
    console.log("Listening on port: ", config.port);
  });

}) ();

