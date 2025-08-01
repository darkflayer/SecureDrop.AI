# Contributing to SecureDrop.AI

Thank you for your interest in contributing to SecureDrop.AI! Your contributions are valuable and help make this project better for everyone. This guide will help you get started.

## Table of Contents
- [How to Contribute](#how-to-contribute)
- [Project Setup](#project-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Submitting Issues](#submitting-issues)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Code of Conduct](#code-of-conduct)
- [Getting Help](#getting-help)

---

## How to Contribute
- **Open Issues:** Report bugs or suggest features.
- **Fork the Repo:** Make your changes in a forked repository.
- **Submit a Pull Request (PR):** Propose your changes for review.
- **Review & Collaborate:** Respond to feedback and help review other PRs.

## Project Setup

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn
- MongoDB (local or cloud instance)

### 1. Clone the Repository
```bash
git clone https://github.com/darkflayer/SecureDrop.AI.git
cd SecureDrop.AI
```

### 2. Install Dependencies
#### For Client
```bash
cd client
npm install
```
#### For Server
```bash
cd ../server
npm install
```

### 3. Environment Variables
- Copy `.env.example` to `.env` in both `client` and `server` directories and fill in required values.

### 4. Start the Application
#### In separate terminals:
```bash
# Start server
cd server
npm start

# Start client
cd client
npm start
```

- The client will run at `http://localhost:3000` (default).
- The server will run at `http://localhost:5000` (default).

---

## Coding Guidelines
- Use clear, descriptive variable and function names.
- Write comments for complex logic.
- Follow existing code style (Prettier/ESLint rules if present).
- For frontend: Use TypeScript and React best practices.
- For backend: Use Express.js and Mongoose best practices.

## Commit Messages
- Use clear, descriptive commit messages.
- Example: `fix: correct login error handling` or `feat: add password reset feature`

## Submitting Issues
- Search existing issues before opening a new one.
- Provide a clear title and detailed description.
- Add screenshots/logs if helpful.

## Submitting Pull Requests
- Fork the repository and create your branch from `main`.
- Ensure your code builds and passes lint/tests.
- Reference related issues in your PR description.
- Describe what you changed and why.
- Be open to feedback and make requested changes.

## Code of Conduct
This project follows a [Code of Conduct](CODE_OF_CONDUCT.md) to foster a welcoming and respectful community.

## Getting Help
- For questions, open an issue or start a discussion.
- You can also reach out via email: [your-email@example.com]

---
Thank you for contributing! 🎉
