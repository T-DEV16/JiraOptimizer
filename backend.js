// backend.js
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { nanoid } from 'nanoid';
import cors from 'cors';

const app = express();
const port = 3001;

// Use JSON file as storage
const adapter = new JSONFile('db.json');
const db = new Low(adapter, { tasks: [] });
await db.read();


app.use(cors());
app.use(express.json());

// Routes

app.get('/tasks', (req, res) => {
  res.json(db.data.tasks);
});

app.post('/tasks', async (req, res) => {
  const task = { id: nanoid(), ...req.body };
  db.data.tasks.push(task);
  await db.write();
  res.json(task);
});

app.patch('/tasks/:id', async (req, res) => {
  const task = db.data.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).send('Not found');
  Object.assign(task, req.body);
  await db.write();
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  db.data.tasks = db.data.tasks.filter(t => t.id !== req.params.id);
  await db.write();
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`🚀 JSON backend running at http://localhost:${port}`);
});


app.get('/', (req, res) => {
  res.send('✅ JSON API is running. Try your tasks');
});