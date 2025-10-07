const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "acm-secret",
    resave: false,
    saveUninitialized: false,
  })
);

const upload = multer({ dest: "uploads/" });

let accounts = fs.existsSync("accounts.json")
  ? JSON.parse(fs.readFileSync("accounts.json"))
  : [];
const events = JSON.parse(fs.readFileSync("events.json"));
let submissions = fs.existsSync("submissions.json")
  ? JSON.parse(fs.readFileSync("submissions.json"))
  : [];
let winners = fs.existsSync("winners.json")
  ? JSON.parse(fs.readFileSync("winners.json"))
  : {};

function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

app.get("/", (req, res) =>
  req.session.user ? res.redirect("/events") : res.redirect("/login")
);

app.get("/login", (req, res) => res.render("login"));
app.post("/login", (req, res) => {
  const { id, password } = req.body;
  const user = accounts.find((a) => a.id === id && a.password === password);
  if (!user) return res.render("login", { error: "Invalid credentials" });
  req.session.user = user;
  res.redirect("/events");
});

app.get("/signup", (req, res) => res.render("signup"));
app.post("/signup", (req, res) => {
  const { id, name, password } = req.body;
  if (accounts.find((a) => a.id === id))
    return res.render("signup", { error: "ID already exists" });
  const newUser = { id, name, password };
  accounts.push(newUser);
  fs.writeFileSync("accounts.json", JSON.stringify(accounts, null, 2));
  req.session.user = newUser;
  res.redirect("/events");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

app.get("/events", isAuthenticated, (req, res) => {
  res.render("events", { user: req.session.user, events });
});

app.get("/quest/:id", isAuthenticated, (req, res) => {
  const event = events.find((e) => e.id === req.params.id);
  if (!event) return res.status(404).send("Event not found");
  res.render("quest", { user: req.session.user, event });
});

app.post("/upload/:id", isAuthenticated, upload.single("photo"), async (req, res) => {
  const eventId = req.params.id;
  const event = events.find((e) => e.id === eventId);
  if (!event) return res.status(404).send("Event not found");
  const user = req.session.user.id;
  try {
    const imageData = fs.readFileSync(req.file.path);
    const blipResponse = await axios.post(
      "http://127.0.0.1:5001/caption",
      imageData,
      { headers: { "Content-Type": "application/octet-stream" } }
    );
    const caption = blipResponse.data.generated_text || "No caption";
    submissions.push({
      eventId,
      user,
      caption,
      timestamp: new Date().toISOString(),
    });
    fs.writeFileSync("submissions.json", JSON.stringify(submissions, null, 2));
    res.render("message", { message: "✅ Photo submitted successfully!" });
  } catch (err) {
    res.status(500).send("Error generating caption");
  }
});

app.get("/winners/:id", isAuthenticated, async (req, res) => {
  const event = events.find((e) => e.id === req.params.id);
  if (!event) return res.status(404).send("Event not found");

  const now = new Date();
  const end = new Date(event.endDate);
  if (now < end)
    return res.render("winners", {
      event,
      pending: true,
      winners: [],
    });

  if (winners[event.id])
    return res.render("winners", { event, winners: winners[event.id], pending: false });

  const eventSubs = submissions.filter((s) => s.eventId === event.id);
  if (eventSubs.length === 0)
    return res.render("winners", { event, winners: [], pending: false });

  const captionsList = eventSubs
    .map((s) => `${s.user}: "${s.caption}"`)
    .join("\n");

  const prompt = `
You are judging a photo challenge for the event "${event.title}".
Theme: ${event.theme}.
Participants and their captions:
${captionsList}
Pick the top 3 most creative and relevant captions.
Respond ONLY in JSON like this:
[
  {"user": "id1", "reason": "reason"},
  {"user": "id2", "reason": "reason"},
  {"user": "id3", "reason": "reason"}
]
`;

  try {
    const geminiResp = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      { contents: [{ parts: [{ text: prompt }] }] },
      { params: { key: process.env.GEMINI_API_KEY } }
    );
    const text = geminiResp.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = [{ user: "Parsing error", reason: text }];
    }
    winners[event.id] = result;
    fs.writeFileSync("winners.json", JSON.stringify(winners, null, 2));
    res.render("winners", { event, winners: result, pending: false });
  } catch {
    res.status(500).send("Gemini error");
  }
});

app.listen(3000, () => console.log("🚀 Running on http://localhost:3000"));
