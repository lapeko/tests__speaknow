# Full-Stack Assignment: Fault-Tolerant System Design

This is a full-stack, event-driven task processing system with fault-tolerance features. The goal is to simulate asynchronous task processing with retries, failures, and dead-letter handling — using AWS services and a modern Angular frontend.

Tech stack:
- Frontend: Angular 20 + NGXS + Angular Material
- Backend: Node.js + AWS (Lambda, API Gateway, SQS, DynamoDB, DLQ)
- Infra: Serverless Framework

How to run:

1) Make sure you have Node.js v20.x or higher, AWS CLI configured, and permissions to deploy Lambda, API Gateway, SQS, DynamoDB, CloudWatch. You’ll also need Angular CLI (`npm install -g @angular/cli`) and Serverless Framework (`npm install -g serverless`).

2) From the root of the repo, go into the backend folder:

``` bash
cd ./backend  
npm install  
npm run deploy
```

3) After deployment, copy the API Gateway URL from the terminal output. It should look like:  
POST - https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/dev/tasks  
GET  - https://xxxxxxxxxx.execute-api.eu-central-1.amazonaws.com/dev/tasks  

4) Now, from root, go to the frontend:

``` bash
cd ../frontend  
npm install
```

5) Open `src/environments/environment.ts` and replace:

``tasksApiUrl: <insert your api url here>``

with your actual deployed API URL from step 3.

6) Run the frontend:

``` bash
ng serve
```  

Then open `http://localhost:4200/` in your browser.

Implemented features:

Frontend:
- Form to submit a task answer (with auto-generated taskId)
- Task dashboard showing taskId, answer, status (Pending, Processed, Failed), retry count, and error message (if any)
- Visual feedback during submission
- Mobile-first responsive layout
- Angular Material components used for UI

Backend:
- REST API via API Gateway + Lambda (`/tasks` POST and GET)
- Asynchronous task processing using SQS + Lambda
- Randomized task failure simulation (30%)
- Retry mechanism with exponential backoff (up to 2 attempts)
- Dead Letter Queue (DLQ) for failed tasks
- DLQ monitor Lambda that logs to CloudWatch
- DynamoDB stores: taskId, answer, status, retries, errorMessage

Notes:
The layout is not pixel-perfect, but follows Figma generally. Used Angular Material for fast prototyping, though Tailwind would be more aligned with the design. The UI is responsive and mobile-friendly. Polling or WebSockets for real-time updates not implemented (optional bonus). Time spent on the task: approximately 4–6 hours (half a day).

Contact:  
Vitali Lapeka  
lapeko88@gmail.com  
LinkedIn: https://www.linkedin.com/in/vitali-lapeka-624a66167/
GitHub: https://github.com/lapeko

Thanks for the opportunity.
