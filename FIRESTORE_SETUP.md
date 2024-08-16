# Firestore Setup and Permissions Guide

## Issue: Permission Denied Error

We're encountering a "Permission denied on resource project SolarQuoteManager" error when trying to save data to Firestore. This indicates that the service account used by our application doesn't have the necessary permissions to write to the Firestore database.

## Solution: Update Service Account Permissions

To resolve this issue, follow these steps to check and update the service account permissions:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select the "SolarQuoteManager" project.
3. Navigate to "IAM & Admin" > "Service Accounts" in the left sidebar.
4. Find the service account associated with this key file:
   `/Users/mattdreier/Documents/solar-quote-manager/solarquotemanager-2d7b3acbc284.json`
5. Click on the service account name to view its details.
6. Go to the "Permissions" tab.
7. Click "Add Principal" at the top of the page.
8. In the "New principals" field, enter the service account's email address.
9. For the "Select a role" field, choose "Cloud Datastore User" (this role includes permissions for Firestore).
10. Click "Save".

## Verify Permissions

After updating the permissions:

1. Wait a few minutes for the changes to propagate.
2. Restart the backend server.
3. Try uploading a file again to see if the permission error is resolved.

## Additional Troubleshooting

If you're still encountering issues after updating the permissions:

1. Double-check that you're using the correct service account key file in your `.env` file.
2. Ensure that Firestore is enabled for your project in the Firebase Console.
3. Verify that your Firestore security rules allow write operations for authenticated service accounts.

If the issue persists, please review the Google Cloud Console logs for any additional error messages or contact Google Cloud Support for further assistance.