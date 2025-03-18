# Google Meet Clone

This project is a simple video conferencing application inspired by Google Meet. It allows users to create and join virtual meetings using WebRTC and Socket.io.

## Features
- Create and join meeting rooms
- Real-time video and audio communication
- Room-based user management
- WebRTC for peer-to-peer connections
- Socket.io for signaling and communication
- Simple and intuitive UI

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** SQLite (via `sqlite3` package)
- **WebRTC:** For peer-to-peer video and audio communication

## Installation
### Prerequisites
- Node.js installed on your system
- npm (Node Package Manager)

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/Sha-330/Google-Meet-Clone.git
   cd google-meet-clone
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## Folder Structure
```
├── database.js  # SQLite database setup and functions
├── server.js    # Backend server using Express and Socket.io
├── index.html   # Frontend UI
├── meet_clone.db  # SQLite database file
├── package.json  # Project dependencies and metadata
├── package-lock.json  # Lock file for dependency versions
```


