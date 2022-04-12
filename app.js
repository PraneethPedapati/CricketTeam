let express = require("express");
let path = require("path");
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");

let app = express();
app.use(express.json());

module.exports = app;

let dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

let initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3001, () => {
      console.log("Server Running Successfully...!!!");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  let getPlayersQuery = `
        SELECT player_id AS playerId, player_name AS playerName, jersey_number AS jerseyNumber, role
        FROM cricket_team
    `;
  let players = await db.all(getPlayersQuery);
  response.send(players);
});

app.post("/players/", async (request, response) => {
  let playerDetails = request.body;
  let { playerName, jerseyNumber, role } = playerDetails;
  let postPlayersQuery = `
       INSERT INTO cricket_team
       (player_name, jersey_number, role)
       VALUES ("${playerName}", ${jerseyNumber}, "${role}")
    `;
  await db.run(postPlayersQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let getPlayersQuery = `
        SELECT player_id AS playerId, player_name AS playerName, jersey_number AS jerseyNumber, role
        FROM cricket_team
        WHERE player_id = ${playerId}
    `;
  let players = await db.get(getPlayersQuery);
  response.send(players);
});

app.put("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let playerDetails = request.body;
  let { playerName, jerseyNumber, role } = playerDetails;
  let updatePlayersQuery = `
       UPDATE cricket_team
       SET player_name = "${playerName}", jersey_number = ${jerseyNumber}, role = "${role}"
       WHERE player_id = ${playerId}
    `;
  await db.run(updatePlayersQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let playerDetails = request.body;
  let { playerName, jerseyNumber, role } = playerDetails;
  let deletePlayersQuery = `
       DELETE FROM cricket_team
       WHERE player_id = ${playerId}
    `;
  await db.run(deletePlayersQuery);
  response.send("Player Removed");
});
