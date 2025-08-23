# Backend Server Setup Instructions

## Issue Fixed ✅

The "TypeError: Failed to fetch" error was occurring because the backend server was not running. This has been resolved with improved error handling in the frontend.

## How to Start the Backend Server

### 1. Navigate to the server directory:
```bash
cd server
```

### 2. Install dependencies (if not already done):
```bash
npm install
```

### 3. Start the server:
```bash
npm start
```

### 4. Verify the server is running:
The server should start on `http://localhost:5000` and display:
```
SecureDrop.AI API Running ✅
```

## Environment Variables Required

Make sure you have a `.env` file in the `server` directory with:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Email Service (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Services (optional)
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Frontend Error Handling ✅

The frontend now includes robust error handling that:

- ✅ Detects when the backend is offline
- ✅ Shows clear error messages to users
- ✅ Allows manual organization code entry when search is unavailable
- ✅ Provides connection retry functionality
- ✅ Displays helpful troubleshooting information

## Current Status

- **Frontend**: Running with improved error handling
- **Backend**: Needs to be started manually (see instructions above)
- **Database**: Requires MongoDB connection
- **Features**: All functionality works when backend is running

## Quick Test

Once the backend is running, you can test the API:

```bash
curl http://localhost:5000/
```

Should return: `SecureDrop.AI API Running ✅`
