const express = require("express");
const axios = require("axios");
const cors = require("cors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const { check, validationResult, param } = require("express-validator");
require("dotenv").config();

const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());

const API_KEY = "e09eca98a51207e0f0aa35c174e8e2746bc58072";
const RAPIDAPI_KEY = "28a1c31e1cmshcfc14a57b395d88p161023jsn86047e473e09";
const USERNAME = "abusayeid";
const BASE_URL = "https://clist.by/api/v1/json/contest/";
const RESOURCE_BASE_URL = "https://clist.by/api/v1/json/resource/";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "contest_tracker",
};

const authMiddleware = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;

  console.log(req.body);

  try {
    const connection = await mysql.createConnection(dbConfig);
    if (connection) {
      console.log("connected");
    } else {
      console.log("not connected");
    }
    const [existingUser] = await connection.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      await connection.end();
      return res.status(400).json({ msg: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await connection.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    await connection.end();
    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      "SELECT id, username, password FROM users where username = ?",
      [username]
    );

    if (rows.length === 0) {
      await connection.end();
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await connection.end();
      return res.status(400).json({ msg: "Wrong Password" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    await connection.end();

    res.json({ token });
  } catch (error) {}
});

app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT id, username FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      await connection.end();
      return res.status(404).json({ msg: "User not found" });
    }
    const user = rows[0];
    await connection.end();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const populateResources = async () => {
  try {
    const response = await axios.get("https://clist.by/api/v1/json/resource/", {
      params: {
        username: USERNAME,
        api_key: API_KEY,
        limit: 500,
      },
    });

    const resources = response.data.objects;

    const connection = await mysql.createConnection(dbConfig);

    for (const resource of resources) {
      const id = resource.id !== undefined ? resource.id : null;
      const name = resource.name !== undefined ? resource.name : null;

      if (id && name) {
        await connection.execute(
          `INSERT IGNORE INTO resources (id, name) VALUES(?,?)
                    `,
          [id, name]
        );
      }
    }

    await connection.end();
    console.log("Resources populated successfully.");
  } catch (error) {
    console.error("Error populating resources:", error);
  }
};

const populateContests = async () => {
  try {
    const response = await axios.get("https://clist.by/api/v1/json/contest/", {
      params: {
        username: USERNAME,
        api_key: API_KEY,
        limit: 500,
      },
    });

    const contests = response.data.objects;

    const connection = mysql.createConnection(dbConfig);

    for (const contest of contests) {
      const id = contest.id !== undefined ? contest.id : null;
      const event = contest.event !== undefined ? contest.event : null;
      const start = contest.start !== undefined ? contest.start : null;
      const end = contest.end !== undefined ? contest.end : null;
      const resourceId =
        contest.resource.id !== undefined ? contest.resource.id : null;
      const duration = contest.duration !== undefined ? contest.duration : null;
      const href = contest.href !== undefined ? contest.href : null;

      if (id && event && start && end && resourceId ) {
        try {
          (await connection).execute(
            `
                    INSERT INTO contests (id, event, start, end, resource_id, duration, href) 
                    VALUES (?,?,?,?,?,?,?)
                    ON DUPLICATE KEY UPDATE 
                    event = VALUES(event),
                    start = VALUES(start),
                    end = VALUES(end),
                    resource_id = VALUES(resource_id),
                    duration = VALUES(duration),
                    href = VALUES(href)`,
            [id, event, start, end, resourceId, duration, href]
          );
        } catch (error) {
          console.error(
            `Error inserting contest with id ${id} and resource_id ${resourceId}:`,
            error
          );
        }
      } else {
        console.error(
          `Skipping contest with id ${id} due to missing required fields`
        );
      }
    }

    (await connection).end();

    console.log("Contests populated successfully.");
  } catch (error) {
    console.error("Error populating contests:", error);
  }
};

 populateResources();
 populateContests();

app.get("/api/user/dashboard", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const connection = await mysql.createConnection(dbConfig);

    const [upcomingContests] = await connection.execute(
      `
          SELECT c.id, c.event, c.start, c.end, r.name as resource_name
          FROM contests c
          JOIN resources r ON c.resource_id = r.id
          WHERE c.start > NOW() AND c.id IN (SELECT contest_id FROM user_participation WHERE user_id = ?)
          ORDER BY c.start ASC
          LIMIT 5
      `,
      [userId]
    );

    const [bookmarkedContests] = await connection.execute(
      `
        SELECT c.id, c.event, c.start, c.end, r.name as resource_name
        FROM contests c
        JOIN resources r ON c.resource_id = r.id
        WHERE c.id IN (SELECT contest_id FROM user_bookmarks WHERE user_id = ?)
        ORDER BY c.start ASC
        LIMIT 5
    `,
      [userId]
    );

    await connection.end();

    res.json({ upcomingContests, bookmarkedContests });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user dashboard data" });
  }
});

app.post("/api/contests/:id/participate", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const contestId = req.params.id;

  try {
    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(
      `INSERT INTO user_participation (user_id, contest_id) VALUES(?, ?) `,
      [userId, contestId]
    );

    await connection.end();

    res.status(200).json({ msg: "Marked as participating" });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark participate contest" });
  }
});

app.post("/api/contests/:id/bookmark", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const contestId = req.params.id;

  try {
    const connection = await mysql.createConnection(dbConfig);

    await connection.execute(
      `INSERT INTO user_bookmarks (user_id, contest_id) VALUES(?,?)`,
      [userId, contestId]
    );

    await connection.end();

    res.status(200).json({ msg: "Bookmarked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to bookmark contest" });
  }
});

app.get("/api/contests", async (req, res) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        start__gt: new Date().toISOString(),
        order_by: "start",
        username: USERNAME,
        api_key: API_KEY,
      },
    });
    res.json(response.data.objects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contests" });
  }
});

app.get("/api/contests/:id", async (req, res) => {
  const contestId = req.params.id;

  try {
    const response = await axios.get(`${BASE_URL}${contestId}`, {
      params: {
        username: USERNAME,
        api_key: API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contest details" });
  }
});

app.get("/api/resources", async (req, res) => {
  try {
    const response = await axios.get("https://clist.by/api/v1/json/resource/", {
      params: {
        username: USERNAME,
        api_key: API_KEY,
      },
    });
    res.json(response.data.objects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resources" });
  }
});

app.get("/api/resources/:id", async (req, res) => {
  const resourceId = req.params.id;
  try {
    const response = await axios.get(
      `https://clist.by/api/v1/json/resource/${resourceId}/`,
      {
        params: {
          username: USERNAME,
          api_key: API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resource details" });
  }
});

app.get("/api/problems", async (req, res) => {
  try {
      const response = await axios.get("https://codeforces.com/api/problemset.problems");
      const problems = response.data.result.problems.slice(0, 10); 
      res.json(problems);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch problems" });
  }
});

app.post("/api/execute", async (req, res) => {
  const { code } = req.body;

  try {
     
      const submissionResponse = await axios.post("https://judge0-ce.p.rapidapi.com/submissions", {
          source_code: code,
          language_id: 54, 
          stdin: "" 
      }, {
          headers: {
              "Content-Type": "application/json",
              "x-rapidapi-key": RAPIDAPI_KEY,
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
          }
      });

      const token = submissionResponse.data.token;

      
      let result;
      do {
          result = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
              headers: {
                  "x-rapidapi-key": RAPIDAPI_KEY,
                  "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
              }
          });
      } while (result.data.status.id <= 2); 

      res.json({ output: result.data.stdout || result.data.stderr });
  } catch (error) {
      res.status(500).json({ error: "Failed to execute code" });
  }
});

app.post('/api/send-message', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
  }
  console.log("Message received from:", { name, email, message });
  res.json({ success: true, message: "Message received!" });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

