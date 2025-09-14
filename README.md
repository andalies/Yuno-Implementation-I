Integration demo of Yuno Payments Web SDK with a Vite + React (TypeScript) frontend and an Express (TypeScript) backend.

⚡ Goal: show secure, idempotent payment flows with a real checkout modal and server-side session handling.

✨ Features

Frontend (client)

React + Redux cart with add/remove/clear items.

Checkout modal powered by Yuno Web SDK (@yuno-payments/sdk-web).

useYuno hook with multiple fallbacks (CDN, window.Yuno, dynamic import)

yuno

.

Checkout component mounts Yuno modal and calls backend endpoints

index

.

Backend (server)

Express + Axios.

POST /api/create-checkout-session → creates a Yuno checkout session.

POST /api/create-payment → finalizes payment with one-time token.

Idempotency via X-Idempotency-Key.


Security

Public key only in frontend (VITE_YUNO_PUBLIC_KEY).

Secret key only in backend.

Amounts recomputed server-side to avoid tampering.

Idempotent endpoints prevent duplicate charges.

⚙️ Setup
1. Clone & install
git clone https://github.com/andalies/Yuno-Implementation-I
cd Yuno-Implementation-I

2. Environment
Client (client/.env)
VITE_YUNO_PUBLIC_KEY=pk_test_xxx

Server (server/.env)
YUNO_PUBLIC_KEY=pk_test_xxx
YUNO_SECRET_KEY=sk_test_xxx
YUNO_ACCOUNT_ID=acc_xxx        # or ACCOUNT_CODE if provided
YUNO_BASE_URL=https://api-sandbox.y.uno
PORT=4000

3. Install dependencies
cd client && npm i
cd ../server && npm i

▶️ Run locally

Terminal 1 (server):

cd server
npm run dev


Terminal 2 (client):

cd client
npm run dev


Frontend: http://localhost:3000

Backend: http://localhost:4000

🔄 Endpoints
Method	Path	Purpose
GET	/	Health check
POST	/api/create-checkout-session	Create Yuno checkout session
POST	/api/create-payment	Confirm payment with one-time token
🛒 Flow

Frontend → calls /api/create-checkout-session with cart data.

Backend → calls Yuno API with secret key, returns checkoutSession.

Frontend → mounts Yuno modal with startCheckout.

User selects method, triggers yunoCreatePayment.

Backend → confirms payment with Yuno, responds success.



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
