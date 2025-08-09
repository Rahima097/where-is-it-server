# WhereIsIt - Lost & Found Platform

## Purpose
To create a community-driven platform that helps people reunite with their lost belongings by providing an easy-to-use interface for reporting, searching, and recovering lost or found items.

## Live URL
🌐 **Frontend**: https://whereisit-hub.netlify.app/
🔗 **Backend**: https://where-is-it-server-nine.vercel.app/

## Key Features

### 🔐 Authentication System
- Email/Password authentication
- Google OAuth integration
- Protected routes with JWT authentication
- User profile management

### 📝 Item Management
- Add lost or found items with detailed information
- Upload item images via URL
- Categorize items (pets, documents, gadgets, others)
- Update and delete user's own items
- Real-time status tracking

### 🔍 Search & Browse
- Search items by title or location
- Filter and browse all lost & found items
- View detailed item information
- Responsive card-based layout

### 🎯 Recovery System
- Mark items as recovered with detailed information
- Track recovery location and date
- Recovery history management
- Prevent duplicate recovery claims

### 🎨 User Experience
- Fully responsive design (mobile, tablet, desktop)
- Dynamic page titles
- Loading states and error handling
- Toast notifications for user feedback
- Smooth animations with Framer Motion
- Interactive Lottie animations

### 📊 Dashboard Features
- Personal item management dashboard
- Recovered items tracking
- Layout toggle (card/table view)
- Search functionality across all sections

## JWT Authentication Implementation

### 🔧 Backend JWT Security
- **Firebase Admin SDK** for token verification
- **Protected API Routes** with `verifyFireBaseToken` middleware
- **Email Verification** - ensures users can only access their own data
- **Token Validation** - verifies Firebase ID tokens on each request
- **Error Handling** - 401/403 responses for unauthorized access

### 🎨 Frontend JWT Integration
- **Automatic Token Attachment** - Firebase ID tokens sent with API requests
- **useAxiosSecure Hook** - Custom hook for secure API calls
- **Token Refresh** - Firebase automatically refreshes expired tokens
- **Interceptor Pattern** - Request/response interceptors for token management
- **No Manual Storage** - Firebase handles all token storage automatically

### Frontend NPM Packages Used
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library
- **Firebase Authentication** - User authentication
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **React Helmet Async** - Dynamic document head
- **React DatePicker** - Date selection
- **Swiper.js** - Touch slider
- **Lottie React** - Animation rendering
- **React Toastify** - Toast notifications
- **SweetAlert2** - Beautiful alerts
- **Lucide React** - Icon library
- **React Icons** - Additional icons

### Backend NPM Packages Used
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **JWT** - firebase-admin





