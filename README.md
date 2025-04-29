# SPLOOK
A social platform where users can:
- Send/receive anonymous questions
- Display Q&A on profiles
- Follow other users
- Browse community content

## 🚀 Quick Start

### Prerequisites
- Node.js ≥18
- npm ≥9
- MySQL

```bash
# 1. Clone repo
git clone https://github.com/yourusername/anon-qa-app.git
cd anon-qa-app

# 2. Install dependencies
npm install

# 3. Setup environment
cp client/.env.example client/.env
cp server/.env.example server/.env
# Edit the .env files

# 4. Run development servers
# (On your terminal)
npm run client

# (On a separate terminal)
npm run server

# Note: make sure both terminals are in the root directory of the project.
