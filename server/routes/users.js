const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database/mysql');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, full_name, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users.map(u => ({
      id: u.id,
      username: u.username,
      name: u.full_name,
      email: '',
      role: u.role === 'cashier' ? 'kasir' : u.role,
      createdAt: u.created_at
    })));
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID (admin only)
router.get('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, full_name, role, created_at FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const u = users[0];
    res.json({
      id: u.id,
      username: u.username,
      name: u.full_name,
      email: '',
      role: u.role === 'cashier' ? 'kasir' : u.role,
      createdAt: u.created_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create user (admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { username, password, name, role } = req.body;
    
    // Check if username already exists
    const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Convert role: kasir -> cashier for database
    const dbRole = role === 'kasir' ? 'cashier' : 'admin';
    
    const [result] = await db.query(
      'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, name, dbRole]
    );
    
    const [newUser] = await db.query('SELECT id, username, full_name, role, created_at FROM users WHERE id = ?', [result.insertId]);
    const u = newUser[0];
    
    res.status(201).json({
      id: u.id,
      username: u.username,
      name: u.full_name,
      email: '',
      role: u.role === 'cashier' ? 'kasir' : u.role,
      createdAt: u.created_at
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user (admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { username, name, role } = req.body;
    
    // Check if user exists
    const [existingUser] = await db.query('SELECT id FROM users WHERE id = ?', [req.params.id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if new username is already taken by another user
    if (username) {
      const [usernameCheck] = await db.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, req.params.id]);
      if (usernameCheck.length > 0) {
        return res.status(400).json({ message: 'Username sudah digunakan' });
      }
    }
    
    // Convert role: kasir -> cashier for database
    const dbRole = role === 'kasir' ? 'cashier' : 'admin';
    
    await db.query(
      'UPDATE users SET username = ?, full_name = ?, role = ? WHERE id = ?',
      [username, name, dbRole, req.params.id]
    );
    
    const [updatedUser] = await db.query('SELECT id, username, full_name, role, created_at FROM users WHERE id = ?', [req.params.id]);
    const u = updatedUser[0];
    
    res.json({
      id: u.id,
      username: u.username,
      name: u.full_name,
      email: '',
      role: u.role === 'cashier' ? 'kasir' : u.role,
      createdAt: u.created_at
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password (admin only - for any user)
router.put('/:id/password', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }
    
    // Check if user exists
    const [existingUser] = await db.query('SELECT id FROM users WHERE id = ?', [req.params.id]);
    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.params.id]);
    
    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change own password (any authenticated user)
router.put('/me/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password baru minimal 6 karakter' });
    }
    
    // Get current user
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password saat ini salah' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
    
    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    // Prevent deleting yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Tidak bisa menghapus akun sendiri' });
    }
    
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
