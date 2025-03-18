// database.js - SQLite database setup and operations
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Create database connection
const db = new sqlite3.Database(path.join(__dirname, 'meet_clone.db'));

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Create rooms table
    db.run(`
      CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create participants table
    db.run(`
      CREATE TABLE IF NOT EXISTS participants (
        room_id TEXT,
        user_id TEXT,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (room_id, user_id),
        FOREIGN KEY (room_id) REFERENCES rooms(id)
      )
    `);
    
    console.log('Database initialized');
  });
}

// Create a new room
function createRoom() {
  return new Promise((resolve, reject) => {
    const roomId = uuidv4();
    db.run('INSERT INTO rooms (id) VALUES (?)', [roomId], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(roomId);
    });
  });
}

// Get room by ID
function getRoomById(roomId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM rooms WHERE id = ?', [roomId], (err, room) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!room) {
        resolve(null);
        return;
      }
      
      // Get participants in the room
      db.all('SELECT user_id FROM participants WHERE room_id = ?', [roomId], (err, participants) => {
        if (err) {
          reject(err);
          return;
        }
        
        room.participants = participants.map(p => p.user_id);
        resolve(room);
      });
    });
  });
}

// Add user to room
function addUserToRoom(roomId, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR REPLACE INTO participants (room_id, user_id) VALUES (?, ?)',
      [roomId, userId],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
}

// Remove user from room
function removeUserFromRoom(roomId, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM participants WHERE room_id = ? AND user_id = ?',
      [roomId, userId],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
}

module.exports = {
  initializeDatabase,
  createRoom,
  getRoomById,
  addUserToRoom,
  removeUserFromRoom
};
