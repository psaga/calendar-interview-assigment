# Solution (Vue + Nodejs + MongoDB)
There are two types of users, a interviewer and a candidate in this case the last one is a guest user, so no sign up is required. Each interviewer have to enable the slots at the calendar that they can offer for an interview. 
To appoint an interview any candidate have to reach a slot available  (which at least one interviewer have set it as enable), provide their information, and select the interviewer. The interview is not taking place until they confirm it within the email that is sent to them.

After a interview is confirmed, the slot is not longer available for its interviewer and a email will be sent to both parties, with a cancel link. The interviewer could also cancel an interview at calendar.

If any of them decide to cancel the interview, a email notification will be deliver to both parties.

## Demo
The solution is running with Heroku, Firebase and MongoAtlas at the following link: [Let's check the DEMO](https://calendar-assignment-2606931.web.app/)

## Running locally
There are two ways to run the solution locally.

### 1) Using Docker Compose

- Make you sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.
- At root directory run `docker-compose up -d` to execute docker daemon as background, this will build and make available the containers related with client, server and database.
- Open browser at http://localhost:8080
### 2) Preparing the environment manually
- Install [Node](https://nodejs.org/en/download/) (ideally version 14) 
- Install [MongoDB](https://docs.mongodb.com/manual/administration/install-enterprise/)
- Install dependencies at root folder of client and server with `npm run install` 
- Create a .env.local file at client folder, this file will overwrite the environment variables.

    **.env.local**
	>
	    VUE_APP_URL=http://localhost:3000/
- Change the environment variable for server, modifying ./server/.env
	> 
		MONGO_CONNECTION = mongodb://localhost:27017/calendar-mongo?authSource=admin
		URL_APP = http://localhost:8080
- Initialize Mongo daemon using port 27017
- Build server using `npm run build` at server folder.
- Start server using `npm run dev` at server folder.
- Serve client with `npm run serve` at client folder.
- Open browser at http://localhost:8080


NOTE:
> The mails are delivering from a Gmail account, credentials are provided as environment variables, and it's used as dev porpuse as this account has enable the setting to allow risky connections.