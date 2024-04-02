# Event Handler API

## Installation

To get started with this project, follow these steps:

### Prerequisites

- Node.js installed on your machine

### Installation Steps

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/vivek2293/EventHandler.git
   ```

2. Navigate to project directory
    ```bash
    cd EventHandler
    ```

3. Install the dependencies
    ```bash
    npm install
    ```

4. Configure the environment variables:
    - Create a new file named `.env` in the root directory of the project
    - Add the following environment variables to the `.env` file:
      ```bash
      MONGO_URI= your_mongo_db_uri
      ```

5. Start the application
    ```bash
    npm start
    ```

6. The server will start running on `http://localhost:5000`


## API Endpoints

#### Welcome Message

- **GET** `/api/v1/` - Welcome message.

#### Get All Workers

- **GET** `/api/v1/workers` - Retrieve all workers.

#### Create a New Worker

- **POST** `/api/v1/createWorker` - Create a new worker.

#### Get All Appointments

- **GET** `/api/v1/appointments` - Retrieve all appointments.

#### Get All Dates

- **GET** `/api/v1/dates` - Retrieve all dates.

#### Mark or Unmark a Worker for Booking

- **POST** `/api/v1/updateHourlyData` - Mark or unmark a worker for booking for a specific time.

#### Get Worker Status for a Particular Date

- **POST** `/api/v1/workerstatus` - Get the status of a worker for a specific date.

#### Get Worker Status by Particular Time for a Particular Date

- **POST** `/api/v1/workerStatusByTime` - Get the status of all workers for a specific date and time.
