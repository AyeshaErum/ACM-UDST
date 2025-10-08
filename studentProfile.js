const express = require("express");
const fs = require("fs");
const router = express.Router();

// Middleware to check login
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login");
}

// Load student data
let accounts = fs.existsSync("accounts.json")
  ? JSON.parse(fs.readFileSync("accounts.json"))
  : [];
let submissions = fs.existsSync("submissions.json")
  ? JSON.parse(fs.readFileSync("submissions.json"))
  : [];

// Redirect /profile to logged-in student's profile
router.get("/", isAuthenticated, (req, res) => {
  res.redirect(`/profile/${req.session.user.id}`);
});

// Student profile page
router.get("/:id", isAuthenticated, (req, res) => {
  const studentId = req.params.id;
  const student = accounts.find(a => a.id === studentId);
  if (!student) return res.status(404).send("Student not found");

  // XP calculation (example: 100 per submission)
  const xp = submissions.filter(s => s.user === studentId).length * 100;
  const xpRequired = 5000; // set the XP needed for next level

  // Streak calculation (consecutive days with submissions)
  const studentSubs = submissions
    .filter(s => s.user === studentId)
    .map(s => new Date(s.timestamp).toDateString());
  let streak = 0;
  if (studentSubs.length > 0) {
    studentSubs.sort((a,b) => new Date(b) - new Date(a));
    let prev = new Date(studentSubs[0]);
    streak = 1;
    for (let i = 1; i < studentSubs.length; i++) {
      const curr = new Date(studentSubs[i]);
      const diffDays = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        streak++;
        prev = curr;
      } else {
        break;
      }
    }
  }

  // Dummy attributes and achievements
  const attributes = { knowledge: 75, technique: 60, creativity: 80 };
  const achievements = [
    { title: "First Quest Completed", icon: "🏆", description: "Complete your first quest" },
    { title: "5 Submissions", icon: "🎯", description: "Submit 5 photos or tasks" },
    { title: "Streak 3 Days", icon: "🔥", description: "Maintain a 3-day streak" },
  ];

  res.render("studentProfile", {
    student,
    avatarUrl: student.avatarUrl || "/avatars/default.png",
    xp,
    xpRequired,
    streak,
    attributes,
    achievements
  });
});

module.exports = router;
