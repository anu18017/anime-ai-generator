# AI Anime Image Generator

This project is a web application that allows users to generate unique anime-style images using text prompts. It leverages the power of AI to bring your textual descriptions to life as anime art.

**Core Technologies:**
*   **Backend:** Node.js, Express.js
*   **Frontend:** HTML, CSS, JavaScript
*   **Authentication & Database:** Firebase (Google Sign-In, Firestore for credit management)
*   **AI Image Generation:** Replicate API

## Prerequisites

Before you begin, ensure you have the following installed:
*   Node.js and npm (Node Package Manager)
*   Firebase CLI (for deployment): `npm install -g firebase-tools`
*   A Firebase account and a project set up.
*   A Replicate AI account and API token.

## Setup

To get this project up and running, you'll need to configure both the backend and frontend components.

### Backend Setup

1.  **Navigate to the project root directory.**
2.  **Create a `.env` file:**
    *   This file will store your Replicate API token.
    *   Create a new file named `.env` in the root of the project.
    *   Add the following line, replacing `YOUR_REPLICATE_API_TOKEN` with your actual token:
        ```
        REPLICATE_API_TOKEN=YOUR_REPLICATE_API_TOKEN
        ```
3.  **Install Dependencies and Start the Server:**
    *   Open your terminal in the project root directory.
    *   Run the command: `npm install && node server.js`
    *   This will install the necessary Node.js packages and start the backend server, typically on port 5000.

### Frontend Setup

1.  **Configure Firebase:**
    *   Open the `public/script.js` file.
    *   Locate the `firebaseConfig` object at the top of the file.
    *   Replace the placeholder values for `apiKey`, `authDomain`, `projectId`, and `appId` with your actual Firebase project configuration.
        ```javascript
        // Firebase config (replace with your project config)
        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
          projectId: "YOUR_PROJECT_ID",
          appId: "YOUR_APP_ID"
        };
        ```
2.  **Update Replicate API Token in `public/script.js` for Polling:**
    *   The current implementation in `public/script.js` polls the Replicate API directly from the frontend to check image generation status. This requires the Replicate API token to be present in the frontend code.
    *   Locate the `poll` function within `public/script.js`. You will find a line similar to `headers: { Authorization: \`Token YOUR_REPLICATE_API_TOKEN\` }`.
    *   Replace `YOUR_REPLICATE_API_TOKEN` with your actual Replicate API token.
    *   **Security Warning:** Including API tokens directly in client-side JavaScript is a potential security risk, as it can be exposed to users. The current implementation reflects the existing code structure. For improved security, it is highly recommended to modify the application so that status polling is proxied through your backend server, which can securely store and use the API token.

### Deployment

*   **Frontend:**
    *   If you have Firebase CLI installed and configured, you can deploy the frontend (contents of the `public` folder) using the command: `firebase deploy --only hosting` (or simply `firebase deploy` if it's the only service being deployed).
*   **Backend:**
    *   The backend server (`server.js`) can be deployed to any Node.js hosting environment (e.g., Heroku, Google Cloud Run, AWS Elastic Beanstalk).

## Features

*   **Google Authentication:** Securely sign in using your Google account.
*   **Daily Free Credits:** Registered users receive a daily allowance of free credits to generate images.
*   **Prompt-Based Generation:** Create unique anime images by simply typing a descriptive text prompt.
*   **Real-time Updates:** See your remaining credits and image generation status dynamically.

## How it Works

1.  **User Authentication:** The user signs in using their Google account. Firebase Authentication handles this process.
2.  **Credit Check:** Upon login, the system checks and allocates daily free credits for image generation. These are managed using Firebase Firestore.
3.  **Prompt Input:** The user types a text prompt describing the anime image they want to create.
4.  **Backend Request:** The frontend sends the prompt to the backend Node.js server.
5.  **AI Image Generation:** The backend server forwards the request to the Replicate API, using the specific AI model for anime image generation.
6.  **Polling for Results:** The Replicate API processes the request. The frontend polls the Replicate API directly (as per the current `script.js` implementation) to check the status of the image generation.
7.  **Display Image:** Once the image is successfully generated, the frontend receives the image URL from Replicate and displays it to the user.
8.  **Credit Deduction:** One credit is deducted from the user's daily allowance.

## Project Structure

```
.
├── public/
│   ├── index.html      # Main HTML file for the frontend
│   ├── script.js       # Frontend JavaScript (Firebase, API calls, DOM manipulation)
│   └── styles.css      # CSS styles for the frontend
├── .env.example        # Example environment file structure
├── .firebaserc         # Firebase project configuration
├── .gitignore          # Specifies intentionally untracked files that Git should ignore
├── firebase.json       # Firebase deployment rules and hosting configuration
├── package.json        # Lists project dependencies and npm scripts
├── README.md           # This file!
└── server.js           # Backend Express server (handles API requests to Replicate)
```

*   `server.js`: The main file for the Node.js backend. It sets up an Express server, handles API requests for image generation, and communicates with the Replicate API.
*   `public/`: This directory contains all the static assets for the frontend application.
    *   `index.html`: The main page of the web application.
    *   `script.js`: Contains the client-side JavaScript logic, including Firebase authentication, Firestore database interactions for credit management, DOM manipulation, and communication with the backend/Replicate API.
    *   `styles.css`: Contains the CSS rules for styling the web application.
*   `.env.example`: An example file showing the structure required for the `.env` file (which stores sensitive keys like `REPLICATE_API_TOKEN`).
*   `.firebaserc`: Configures which Firebase project is associated with this local project directory.
*   `firebase.json`: Defines rules for Firebase services, primarily for Firebase Hosting (e.g., which directory to deploy, rewrite rules).
*   `package.json`: Standard Node.js manifest file that includes project metadata, dependencies, and scripts.
*   `README.md`: Provides information about the project.

## Contributing

Contributions are welcome! If you have suggestions or improvements, please feel free to fork the repository, make your changes, and submit a pull request.

## License

This project is open source. Please add a suitable license file (e.g., MIT, Apache 2.0) if you intend to distribute it widely.

