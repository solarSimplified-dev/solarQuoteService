# Solar Quote Management System

This project is a solar quote management system using React.js for the frontend and Node.js for the backend, both hosted on Google Cloud Platform. The system uses Anthropic's Claude 3.5 Sonnet for AI processing of solar quotes.

## Project Structure

```
solar-quote-system/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── backend/
    ├── server.js
    ├── cloudStorage.js
    ├── claudeService.js
    └── package.json
```

## Setup Instructions for Developers

1. Clone the repository:
   ```
   git clone [repository-url]
   cd solar-quote-system
   ```

2. Set up environment variables:
   - Create a `.env` file in the `backend` directory with the following content:
     ```
     GOOGLE_CLOUD_PROJECT_ID=your_project_id
     GOOGLE_CLOUD_KEYFILE=path/to/your/keyfile.json
     CLAUDE_API_KEY=your_claude_api_key
     BUCKET_NAME=your_gcs_bucket_name
     ```

3. Update the backend files:
   - In `cloudStorage.js`, uncomment and update the Google Cloud Storage configuration.
   - In `claudeService.js`, replace `YOUR_CLAUDE_API_KEY` with `process.env.CLAUDE_API_KEY`.

4. Install dependencies and start the backend server:
   ```
   cd backend
   npm install
   npm start
   ```

5. In a new terminal, install dependencies and start the frontend development server:
   ```
   cd frontend
   npm install
   npm start
   ```

6. Open a web browser and navigate to `http://localhost:3000` to use the application.

## Detailed Task List for Nontechnical Users

1. **Prepare Your Google Cloud Platform (GCP) Account**
   - [x] Go to https://cloud.google.com/ and click on "Get started for free" or "Sign in" if you already have an account.
   - [x] Once logged in, go to the Google Cloud Console (https://console.cloud.google.com/).
   - [x] In the top-left corner, click on the project dropdown next to the Google Cloud Platform logo.
   - [x] Click on "New Project" in the top-right corner of the modal window.
   - [x] Name your project "SolarQuoteManager" and click "Create".
   - [x] Wait for the project to be created, then select it from the project dropdown.
   - [x] In the search bar at the top, type "Cloud Storage" and click on it in the results.
   - [x] Click "Enable" to activate the Cloud Storage API for your project.
   - [x] In the left sidebar, click on "IAM & Admin" > "Service Accounts".
   - [x] Click "Create Service Account" at the top of the page.
   - [x] Name the service account "solar-quote-manager" and click "Create and Continue".
   - [x] For the role, select "Storage Admin" and click "Continue".
   - [x] Click "Done" to finish creating the service account.
   - [x] Find the newly created service account in the list, click the three dots in the Actions column, and select "Manage keys".
   - [x] Click "Add Key" > "Create new key", choose JSON, and click "Create".
   - [x] Save the downloaded JSON file securely on your computer. Remember its location as you'll need it later.

2. **Set Up Claude API Access**
   - [x] Go to https://www.anthropic.com or the specific Claude API sign-up page.
   - [x] Follow the sign-up process to create an account or log in if you already have one.
   - [x] Navigate to the API section of your account dashboard.
   - [x] Look for an option to generate an API key or reveal your existing API key.
   - [x] Copy the API key and store it securely. You'll need this later.

3. **Prepare Your Local Environment**
   - [x] Go to https://nodejs.org/
   - [x] Download the LTS (Long Term Support) version for your operating system.
   - [x] Run the installer and follow the installation wizard, accepting the default options.
   - [x] Go to https://git-scm.com/downloads
   - [x] Download the version for your operating system.
   - [x] Run the installer and follow the installation wizard, accepting the default options.

4. **Get the Project Files**
   - [x] Open the Command Prompt (on Windows) or Terminal (on Mac/Linux).
   - [x] Type `cd Desktop` and press Enter to navigate to your Desktop.
   - [] Type `git clone [repository-url]` (replace [repository-url] with the actual URL provided by your developer) and press Enter.
   - [x] Once it's done, type `cd solar-quote-system` and press Enter.

5. **Configure the Backend**
   - [x] In the terminal, type `cd backend` and press Enter.
   - [ ] Type `notepad .env` (on Windows) or `nano .env` (on Mac/Linux) and press Enter.
   - [x] In the text editor that opens, add the following lines, replacing the placeholders with your actual information:
     ```
     GOOGLE_CLOUD_PROJECT_ID=SolarQuoteManager
     GOOGLE_CLOUD_KEYFILE=C:\path\to\your\keyfile.json
     CLAUDE_API_KEY=your_claude_api_key
     BUCKET_NAME=solar_quote_manager_bucket
     ```
   - [x] Replace `C:\path\to\your\keyfile.json` with the actual path to the JSON file you downloaded from Google Cloud Platform.
   - [x] Replace `your_claude_api_key` with the API key you got from Anthropic.
   - [x] Save the file and close the text editor.

6. **Start the Backend Server**
   - [x] In the terminal, make sure you're in the `backend` folder (you should see `solar-quote-system\backend` in your terminal).
   - [x] Type `npm install` and press Enter. Wait for it to complete.
   - [x] Once that's done, type `npm start` and press Enter.
   - [x] Keep this terminal window open.

7. **Start the Frontend Server**
   - [x] Open a new terminal window.
   - [ ] Type `cd Desktop\solar-quote-system\frontend` and press Enter.
   - [ ] Type `npm install` and press Enter. Wait for it to complete.
   - [ ] Once that's done, type `npm start` and press Enter.
   - [ ] Keep this terminal window open.

8. **Access the Application**
   - [x] Open your preferred web browser (e.g., Chrome, Firefox, Safari).
   - [x] In the address bar, type `http://localhost:3000` and press Enter.
   - [x] You should now see the Solar Quote Management System interface.

9. **Test the Application**
   - [x] Prepare a sample solar quote document on your computer (it can be a simple text file with some mock solar quote data).
   - [x] On the Solar Quote Management System interface, look for a "Choose File" or "Upload" button.
   - [x] Click this button and select your sample solar quote document.
   - [x] Look for a "Submit" or "Process" button and click it.
   - [x] Wait for the system to process your document. This may take a few moments.
   - [ ] Once processed, you should see the results displayed on the screen. This might include a summary of the quote or key information extracted from the document.

Remember to keep both terminal windows (backend and frontend) open while using the application. If you need to stop the servers, you can press Ctrl+C in each terminal window.

If you encounter any issues during this process, please contact the development team for assistance. Provide them with specific error messages or screenshots to help them troubleshoot more effectively.