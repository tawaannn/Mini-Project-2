const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ owner: req.userId });
  res.json(tasks);
});

router.post('/', auth, async (req, res) => {
  
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    owner: req.userId
  });
  await task.save();
  res.status(201).json(task);
});

router.delete('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!task) return res.status(404).json({ error: 'ไม่พบงาน' });
  res.json({ message: 'ลบสำเร็จ' });
});

module.exports = router;