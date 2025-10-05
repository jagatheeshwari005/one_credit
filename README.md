# Event Management App

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing events. Users can create accounts, log in, and browse or create events.

## Features

- User authentication (Register/Login)
- View all events
- Create new events
- Responsive design
- Clean and modern UI

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or cloud instance)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd event-management
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 4. Start the Application

#### Development Mode

```bash
# Start the server (from the root directory)
npm run server

# In a new terminal, start the React app
npm start
```

The application will be available at `http://localhost:3000`

#### Production Mode

```bash
# Build the React app
npm run build

# Start the production server
NODE_ENV=production node server/index.js
```

## Project Structure

```
event-management/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # Reusable UI components
│       ├── context/        # React context providers
│       ├── pages/          # Page components
│       └── App.js          # Main App component
├── server/                 # Backend Express server
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
├── .env                   # Environment variables
└── package.json           # Project dependencies and scripts
```

## Available Scripts

In the project directory, you can run:

- `npm start` - Start the React development server
- `npm run server` - Start the backend server
- `npm run dev` - Start both frontend and backend in development mode (using concurrently)
- `npm run build` - Build the React app for production
- `npm test` - Run tests

## Technologies Used

- **Frontend**: React.js, React Router, Tailwind CSS, React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
