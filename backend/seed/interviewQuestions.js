const mongoose = require("mongoose");

const InterviewQuestion = require(
  "../models/InterviewQuestion"
);

const questions = [
  {
    question:
      "What is the difference between an array and a linked list?",
    category: "Technical",
    level: "Easy",
    topic: "DSA",
  },
  {
    question:
      "Explain time complexity and space complexity.",
    category: "Technical",
    level: "Easy",
    topic: "DSA",
  },
  {
    question:
      "What is the difference between a process and a thread?",
    category: "Technical",
    level: "Medium",
    topic: "Operating System",
  },
  {
    question:
      "Explain normalization in DBMS.",
    category: "Technical",
    level: "Medium",
    topic: "DBMS",
  },

  {
    question:
      "Tell me about yourself.",
    category: "HR",
    level: "Easy",
    topic: "HR",
  },
  {
    question:
      "Why should we hire you?",
    category: "HR",
    level: "Easy",
    topic: "HR",
  },
  {
    question:
      "What are your strengths and weaknesses?",
    category: "HR",
    level: "Easy",
    topic: "HR",
  },
  {
    question:
      "Where do you see yourself in five years?",
    category: "HR",
    level: "Medium",
    topic: "HR",
  },

  {
    question:
      "Tell me about a challenging project you worked on.",
    category: "Behavioral",
    level: "Medium",
    topic: "Projects",
  },
  {
    question:
      "Describe a time when you solved a difficult problem.",
    category: "Behavioral",
    level: "Medium",
    topic: "Problem Solving",
  },
  {
    question:
      "How do you handle pressure and deadlines?",
    category: "Behavioral",
    level: "Easy",
    topic: "Workplace",
  },

  {
    question:
      "Why do you want to work for this company?",
    category: "Company",
    level: "Easy",
    topic: "Company",
  },
  {
    question:
      "What do you know about our company?",
    category: "Company",
    level: "Easy",
    topic: "Company",
  },
  {
    question:
      "Why should we select you for this role?",
    category: "Company",
    level: "Medium",
    topic: "Company",
  },
];

const seedInterviewQuestions = async () => {
  try {
    await InterviewQuestion.deleteMany({});

    await InterviewQuestion.insertMany(
      questions
    );

    console.log(
      "Interview questions seeded successfully."
    );
  } catch (error) {
    console.error(
      "Interview seed error:",
      error
    );
  }
};

module.exports = seedInterviewQuestions;