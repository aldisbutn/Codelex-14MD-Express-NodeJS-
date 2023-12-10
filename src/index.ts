import express from 'express';
const cors = require('cors');
import { connection } from './db';

const app = express();
const port = 3002;

app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);

app.get('/', async (req, res) => {
  res.json({ message: 'Hello form server' });
});

app.get('/drivers', async (req, res) => {
  // Execute the query to get all drivers
  connection.query('SELECT * FROM drivers', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the drivers as a JSON response
    res.json(results);
  });
});

app.post('/drivers', async (req, res) => {
  const { driverName, racesWon, favTrack, teamName, photoURL, createdAt } = req.body;

  if (!driverName || !racesWon || !favTrack || !teamName || !photoURL || !createdAt) {
    res.status(400).send('Invalid data');
    return;
  }

  connection.query(
    `
  INSERT INTO drivers (driverName, racesWon, favTrack, teamName, photoURL, createdAt)
  VALUES ('${driverName}', '${racesWon}', '${favTrack}', '${teamName}', '${photoURL}', '${createdAt}');
  `,
    (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json({ drivers: results });
    }
  );
});

app.put('/drivers/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const editedDriver = req.body;

  connection.query(
    'UPDATE drivers SET driverName = ?, racesWon = ?, favTrack = ?, teamName = ?, photoURL = ?, createdAt = ? WHERE id = ?',
    [
      editedDriver.driverName,
      editedDriver.racesWon,
      editedDriver.favTrack,
      editedDriver.teamName,
      editedDriver.photoURL,
      editedDriver.createdAt,
      id,
    ],
    (error) => {
      if (error) {
        console.error('Error updating driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json(editedDriver);
    }
  );
});

app.delete('/drivers/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  connection.query(
    `
  DELETE FROM drivers WHERE id = ?
  `,
    id,
    (error, results) => {
      if (error) {
        console.error('Error deleting driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      res.json(results);
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
