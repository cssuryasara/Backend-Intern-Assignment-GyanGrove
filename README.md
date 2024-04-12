## Project: Event Management API

RESTful service that manages and queries event data based on a user's geographical location and a specified date. This service will ingest data from a provided [CSV dataset](https://drive.google.com/file/d/1sZXyOT_V1NcZj3dDQIKY9Ea_W7XdGum_/view?usp=drive_link) and then offer an API to find events for users.


## Tech Stack
**Backend:** Node.js  
**Database:** MongoDB  
Express.js,Mongoose


## Challenges Addressed

* **Error Handling:** error handling is implemented for the handling external API errors and internal server errors. This ensures informative error messages are returned to the client.


## Prerequisites

* Node.js (v16.14.2 or later): Download and install from [https://nodejs.org](https://nodejs.org)
* MongoDB (v7.0.8 or later): Download and install from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
* Code editor (e.g., Visual Studio Code, Sublime Text)

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/cssuryasara/Backend-Intern-Assignment-GyanGrove.git
2. **Install dependencies:**

    Open your terminal or command prompt and navigate to the project directory where you cloned the repository. Then, run the following command to install the required dependencies:

    ```bash
    npm install
3. **Configure MongoDB connection:**

    Create a file named .env in the project root directory. This file will store your MongoDB connection string as an environment variable.

    Inside the .env file, add the following line, replacing mongodb://localhost:27017/assignment with your actual MongoDB connection string:

    MONGODB_URI=mongodb://localhost:27017/assignment

4. **Start the server:**

    Once you've installed the dependencies and configured the MongoDB connection, you can start the server by running:

    ```bash
    node index.js
    ```

    This command will execute the main application file (app.js) and start the server. The server will typically listen on port 3000 by default (you can access the API endpoints documented below).

## API Endpoints

The base URL for all API endpoints is `http://localhost:3000/` (assuming the server runs on port 3000).

**1. Get all events:**

**Method:** GET

**URL:** `/events/find`  
**Params:** `userLatitude`, `userLongitude`, `searchDate`.
**Response format:** JSON array of event objects. Each object has properties like `_id`, `title`, `description`, `date`, `location`, etc. (Customize based on your actual event schema).

**Example request:**
```bash
curl -w "\n" "http://localhost:3000/events/find?userLatitude=40.7128&userLongitude=-74.0060&searchDate=2024-03-15"
```
**Example response:**

```json
{
    "events": [
        {
            "event_name": "Party development available",
            "city_name": "Port Alexander",
            "date": "2024-03-15",
            "weather": "Sunny, 18C",
            "distance_km": "5581.935794256265"
        },
        {
            "event_name": "Air quickly home",
            "city_name": "Lawrenceview",
            "date": "2024-03-16",
            "weather": "Sunny, 18C",
            "distance_km": "9362.811349009195"
        },
        {
            "event_name": "Of ask open",
            "city_name": "New Andrew",
            "date": "2024-03-16",
            "weather": "Sunny, 18C",
            "distance_km": "8525.633748820715"
        },
        {
            "event_name": "Create success",
            "city_name": "New Susanmouth",
            "date": "2024-03-16",
            "weather": "Sunny, 18C",
            "distance_km": "8105.543066005918"
        },
        {
            "event_name": "Phone city",
            "city_name": "Riveraberg",
            "date": "2024-03-16",
            "weather": "Sunny, 18C",
            "distance_km": "13037.310979300939"
        },
        {
            "event_name": "Political check five",
            "city_name": "Lake Timothymouth",
            "date": "2024-03-17",
            "weather": "Sunny, 18C",
            "distance_km": "7393.962754029454"
        },
        {
            "event_name": "Glass although",
            "city_name": "Kathleenfort",
            "date": "2024-03-17",
            "weather": "Sunny, 18C",
            "distance_km": "15874.516804047309"
        },
        {
            "event_name": "Assume by",
            "city_name": "East Brandyfort",
            "date": "2024-03-18",
            "weather": "Sunny, 18C",
            "distance_km": "10753.689934715045"
        },
        {
            "event_name": "Democrat seat nor",
            "city_name": "South Mark",
            "date": "2024-03-18",
            "weather": "Sunny, 18C",
            "distance_km": "11211.542275006403"
        },
        {
            "event_name": "May",
            "city_name": "New Brittany",
            "date": "2024-03-19",
            "weather": "Sunny, 18C",
            "distance_km": "4301.210711277553"
        }
    ],
    "page": 1,
    "pageSize": 10,
    "totalEvents": 43,
    "totalPages": 5
}
```

**Error codes:**  
200: Ok - If events are found.  
404: Not Found - If no events are found in the database.  
500: Internal Server Error - For unexpected errors.

**2. Add Events Into Database:**

**Method:** POST

**URL:** `/add`  

<img src="https://github.com/cssuryasara/Backend-Intern-Assignment-GyanGrove/blob/main/screenshots/Screenshot%20(328).png">

