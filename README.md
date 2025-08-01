SecureDrop.AI


Your Voice, Heard Anonymously
Real-time, AI-powered anonymous complaint and feedback platform for organizations.

🌟 Overview
SecureDrop.AI is a modern web application that empowers users to submit complaints or feedback to organizations anonymously and securely. With advanced AI-driven categorization and analytics, 
organizations can understand, prioritize, and act on feedback efficiently—while users remain protected and untraceable.


Live Demo:-https://securedropai.vercel.app/

🚀 Key Features
Anonymous Complaint Submission: Users can submit complaints or feedback without revealing their identity.
AI-Powered Categorization: Complaints are automatically categorized and analyzed for severity, urgency, sentiment, and risk using advanced AI models.
Organization-Based Routing: Users select their organization, ensuring feedback reaches the right team.
Media Support: Attach images or videos to complaints, securely uploaded to cloud storage.
Complaint Tracking: Users can track the status and responses to their submissions using a unique complaint ID.
Admin Dashboard: Secure admin portal for managing, viewing, and analyzing complaints.
Real-Time Analytics: Visual dashboards with charts (severity, category breakdown, timelines, etc.) for actionable insights.
Automated Suggestions: AI provides suggested actions, reply templates, and escalation recommendations for admins.
Email Notifications: Secure password reset and admin notifications via email.
Role-Based Access: Distinct flows for users and admins, protecting sensitive operations.

<img width="1293" height="616" alt="Screenshot (1533)" src="https://github.com/user-attachments/assets/dc32ce80-9d58-4096-ac7c-9df0d260da84" />

<img width="1366" height="614" alt="Screenshot (1534)" src="https://github.com/user-attachments/assets/62034cd4-d05e-4ee5-8e66-3bcf948dbadb" />

<img width="1366" height="588" alt="Screenshot (1535)" src="https://github.com/user-attachments/assets/8c4b4c2d-e31d-4aca-9da6-cc94101e7c84" />
<img width="1293" height="565" alt="Screenshot (1536)" src="https://github.com/user-attachments/assets/f808be33-4ad7-49ae-86a0-d561c71eab72" />

🛠 Tech Stack
#Frontend

React (TypeScript)
React Router DOM
Chart.js (via react-chartjs-2)
Tailwind CSS
Axios
Heroicons


#Backend

Node.js
Express.js
MongoDB (Mongoose)
JWT (Authentication)
Multer & Cloudinary (Media uploads)
Nodemailer (Email services)
AI Integrations: OpenAI, Google Generative AI, custom AI modules

#Other

Socket.io (real-time features)
dotenv (environment config)
Bcrypt.js (password hashing)


🗂 Project Structure
secure-drop/
  ├── client/      # React frontend
  │   └── src/
  │       ├── pages/         # Landing, Organization Select, Complaint, Track, Admin (Analytics, Dashboard, etc.)
  │       └── components/    # Shared components (Logo, UI elements)
  └── server/     # Node.js backend
      ├── controllers/       # Business logic (complaints, admin, org)
      ├── models/            # Mongoose schemas (Complaint, Admin, Organization)
      ├── routes/            # API endpoints
      ├── utils/             # AI analysis, categorization, email, cloud uploads
      └── uploads/           # Media storage (if not using cloud)
      
📊 Example Analytics (Admin)

Complaint Volume Over Time
Category Distribution
Severity/Urgency Heatmaps
AI Risk Scores
Suggested Actions & Escalation Flags


⚡️ Quick Start

Prerequisites

Node.js (v18+ recommended)
MongoDB instance (local or Atlas)
Cloudinary account (for media uploads)
OpenAI/Google AI API keys (for AI features)

Setup

Clone the repo:
bash

git clone https://github.com/yourusername/secure-drop.git
cd secure-drop
Configure Environment Variables:
Copy .env.example to 
.env
 in both server/ and client/ and fill in required values (MongoDB URI, JWT secret, Cloudinary, email, AI keys, etc).
Install Dependencies:
bash

cd server
npm install
cd ../client
npm install
Run the App:
Backend:

cd server && npm run dev

Frontend:
cd client && npm start

Access the App:
User Portal: http://localhost:3000
Admin Portal: http://localhost:3000/admin/login
🔒 Security & Privacy
All complaints are stored without user-identifying information.
JWT-based authentication for admin routes.
Passwords are hashed with bcrypt.
Media files are uploaded securely to Cloudinary.


AI analysis is performed server-side; no user data is shared externally except for AI analysis.

🤖 AI & Automation
Categorizer: Classifies complaints into topics using both rule-based and AI-powered logic.

AI Analyzer: Assesses sentiment, urgency, severity, and risk; suggests admin actions.
Similar Complaints: Finds related complaints to aid in pattern recognition and faster resolution.


👤 Roles
User: Submit, track, and follow up on complaints anonymously.
Admin: View/manage complaints, analyze trends, respond, and reset passwords.

📝 License
----working on


💡 Inspiration

SecureDrop.AI is inspired by the need for safe, anonymous feedback in organizations—empowering voices, surfacing issues, and enabling data-driven action.


🙌 Contributing

Pull requests and suggestions are welcome!
For major changes, please open an issue first to discuss what you would like to change.


📬 Contact

For questions, support, or demo requests: rautanhemu@gmail.com
