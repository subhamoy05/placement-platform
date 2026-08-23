require("dotenv").config();

const User = require("./models/User");
const DSAQuestion = require("./models/DSAQuestion");
const SQLQuestion = require("./models/SQLQuestion");
const Assessment = require("./models/Assessment");
const Submission = require("./models/Submission");
const AssessmentResult = require("./models/AssessmentResult");
const InterviewQuestion = require("./models/InterviewQuestion");
const Company = require("./models/Company");
const UserProgress = require("./models/UserProgress");

console.log("Model loading test started...");

console.log("User:", User.modelName);
console.log("DSAQuestion:", DSAQuestion.modelName);
console.log("SQLQuestion:", SQLQuestion.modelName);
console.log("Assessment:", Assessment.modelName);
console.log("Submission:", Submission.modelName);
console.log("AssessmentResult:", AssessmentResult.modelName);
console.log("InterviewQuestion:", InterviewQuestion.modelName);
console.log("Company:", Company.modelName);
console.log("UserProgress:", UserProgress.modelName);

console.log("All models loaded successfully.");
