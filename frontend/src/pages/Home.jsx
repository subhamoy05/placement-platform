import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CodeIcon,
  DatabaseIcon,
  AssessmentIcon,
  InterviewIcon,
  CompanyIcon,
  SparklesIcon,
  ZapIcon,
  CheckIcon,
  ArrowRightIcon,
  TrophyIcon,
  TerminalIcon,
  StarIcon,
  ShieldIcon
} from "../components/Icons";

function Home() {
  const { isAuthenticated } = useAuth();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("dsa");

  // Track scroll position for dynamic top progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalScroll > 0) {
        const currentScroll = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const companiesList = [
    { name: "Google", role: "SWE / L3-L4", dsaLevel: "Hard", questions: "68 Qs", color: "#4285F4" },
    { name: "Microsoft", role: "SDE-1 / SDE-2", dsaLevel: "Medium-Hard", questions: "84 Qs", color: "#00A4EF" },
    { name: "Amazon", role: "SDE-1", dsaLevel: "Medium", questions: "112 Qs", color: "#FF9900" },
    { name: "Atlassian", role: "Graduate SWE", dsaLevel: "Hard", questions: "42 Qs", color: "#0052CC" },
    { name: "Uber", role: "Software Engineer", dsaLevel: "Hard", questions: "56 Qs", color: "#FFFFFF" },
    { name: "Adobe", role: "MTS-1", dsaLevel: "Medium", questions: "64 Qs", color: "#FF0000" },
  ];

  return (
    <div className="home-page">
      {/* Dynamic Scroll Progress Bar */}
      <div
        className="global-scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Cyber Background Glow Orbs */}
      <div className="home-orb home-orb-1" />
      <div className="home-orb home-orb-2" />
      <div className="home-orb home-orb-3" />
      <div className="cyber-grid-overlay" />

      {/* Sticky Frosted Glass Navbar */}
      <nav className="home-navbar">
        <div className="home-logo-container">
          <div className="home-logo-icon">
            <ZapIcon size={20} color="#030407" />
          </div>
          <span className="home-logo-text">
            Placement<span className="home-logo-accent">Prep</span>
          </span>
          <span className="nav-version-badge">PRO v2.5</span>
        </div>

        <div className="home-nav-links">
          <a href="#features" className="nav-link-item">
            Features
          </a>
          <a href="#playground" className="nav-link-item">
            Playground
          </a>
          <a href="#companies" className="nav-link-item">
            Companies
          </a>
          <a href="#readiness" className="nav-link-item">
            Readiness
          </a>

          {isAuthenticated ? (
            <Link to="/dashboard" className="nav-dashboard-button">
              <SparklesIcon size={16} />
              <span>Dashboard</span>
            </Link>
          ) : (
            <div className="nav-auth-group">
              <Link to="/login" className="nav-login-button">
                Sign In
              </Link>
              <Link to="/register" className="nav-cta-button">
                <span>Start Free</span>
                <ArrowRightIcon size={14} />
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-pulse-dot" />
            <ZapIcon size={14} color="#D4FF24" />
            <span>AI-POWERED TECHNICAL PLACEMENT ENGINE</span>
          </div>

          <h1 className="hero-heading">
            Prepare Smarter.
            <br />
            <span className="hero-neon-gradient">Get Placement Ready.</span>
          </h1>

          <p className="hero-description">
            The next-generation technical preparation platform. Master DSA algorithms, write high-performance SQL, simulate timed assessments, and crack FAANG-tier mock interviews.
          </p>

          <div className="hero-actions">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="hero-primary-button"
            >
              <span>{isAuthenticated ? "Enter Dashboard" : "Start Practicing Now"}</span>
              <ArrowRightIcon size={18} />
            </Link>

            <a href="#playground" className="hero-secondary-button">
              <TerminalIcon size={18} />
              <span>Interactive Demo</span>
            </a>
          </div>

          <div className="hero-trust-row">
            <div className="trust-avatars">
              <span className="trust-avatar av-1">A</span>
              <span className="trust-avatar av-2">R</span>
              <span className="trust-avatar av-3">K</span>
              <span className="trust-avatar av-4">S</span>
            </div>
            <div className="trust-text">
              <div className="trust-stars">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} size={13} color="#D4FF24" fill="#D4FF24" />
                ))}
              </div>
              <span>Trusted by <strong>15,000+</strong> candidates cracking top tech offers</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Showcase Card */}
        <div className="hero-card-wrapper">
          <div className="hero-card-glow" />
          <div className="hero-card">
            {/* Floating Achievement Badges */}
            <div className="floating-chip chip-top">
              <TrophyIcon size={14} color="#D4FF24" />
              <span>Offer Unlocked: <strong>Atlassian SWE</strong></span>
            </div>

            <div className="floating-chip chip-bottom">
              <ZapIcon size={14} color="#1558C9" />
              <span><strong>24-Day</strong> Problem Streak</span>
            </div>

            <div className="hero-card-header">
              <div className="header-meta">
                <span className="meta-label">CANDIDATE INTELLIGENCE</span>
                <h3>Placement Readiness Score</h3>
              </div>
              <div className="readiness-pill">
                <span className="readiness-percent">88%</span>
                <span className="readiness-sub">Top 5%</span>
              </div>
            </div>

            <div className="hero-progress-track">
              <div className="hero-progress-fill" style={{ width: "88%" }}>
                <span className="progress-glow-head" />
              </div>
            </div>

            {/* Live Terminal Snippet */}
            <div className="hero-terminal-box">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="terminal-filename">two_sum_optimized.py</span>
                <span className="terminal-badge">Python 3.12</span>
              </div>
              <pre className="terminal-code">
                <code>
                  <span className="token-keyword">def</span> <span className="token-function">twoSum</span>(nums, target):{"\n"}
                  {"  "}lookup = {"{}"}{"\n"}
                  {"  "}<span className="token-keyword">for</span> i, n <span className="token-keyword">in</span> <span className="token-function">enumerate</span>(nums):{"\n"}
                  {"    "}diff = target - n{"\n"}
                  {"    "}<span className="token-keyword">if</span> diff <span className="token-keyword">in</span> lookup:{"\n"}
                  {"      "}<span className="token-keyword">return</span> [lookup[diff], i]{"\n"}
                  {"    "}lookup[n] = i
                </code>
              </pre>
              <div className="terminal-status-bar">
                <div className="status-item ok">
                  <CheckIcon size={13} color="#D4FF24" />
                  <span>3/3 Test Cases Passed</span>
                </div>
                <div className="status-item time">Runtime: 38ms (Beats 96%)</div>
              </div>
            </div>

            <div className="hero-mini-stats">
              <div className="mini-stat-card">
                <strong>180+</strong>
                <span>DSA Solved</span>
              </div>
              <div className="mini-stat-card">
                <strong>95+</strong>
                <span>SQL Queries</span>
              </div>
              <div className="mini-stat-card">
                <strong>45+</strong>
                <span>Company Packs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Counter Bar */}
      <section id="readiness" className="home-metrics-bar">
        <div className="metrics-grid">
          <div className="metric-box">
            <span className="metric-number">15,000+</span>
            <span className="metric-label">Active Aspirants</span>
            <small>Practicing daily across 40+ colleges</small>
          </div>
          <div className="metric-box">
            <span className="metric-number">94.8%</span>
            <span className="metric-label">Placement Success</span>
            <small>Candidates with readiness &gt; 80%</small>
          </div>
          <div className="metric-box">
            <span className="metric-number">250+</span>
            <span className="metric-label">Curated Challenges</span>
            <small>Updated with 2026 hiring patterns</small>
          </div>
          <div className="metric-box">
            <span className="metric-number">₹24.5 LPA</span>
            <span className="metric-label">Average Top Offer</span>
            <small>Across product-based companies</small>
          </div>
        </div>
      </section>

      {/* Interactive Playground Demo */}
      <section id="playground" className="home-section playground-section">
        <div className="home-section-heading">
          <span className="section-eyebrow">INTERACTIVE SUITE</span>
          <h2>Experience the Next-Level Engine</h2>
          <p>
            Test drive our real-time environment built for modern software engineering hiring.
          </p>
        </div>

        <div className="playground-container">
          <div className="playground-nav-tabs">
            <button
              className={`playground-tab ${activeTab === "dsa" ? "active" : ""}`}
              onClick={() => setActiveTab("dsa")}
            >
              <CodeIcon size={16} />
              <span>DSA Arena</span>
            </button>
            <button
              className={`playground-tab ${activeTab === "sql" ? "active" : ""}`}
              onClick={() => setActiveTab("sql")}
            >
              <DatabaseIcon size={16} />
              <span>SQL Sandbox</span>
            </button>
            <button
              className={`playground-tab ${activeTab === "mock" ? "active" : ""}`}
              onClick={() => setActiveTab("mock")}
            >
              <InterviewIcon size={16} />
              <span>AI Mock Simulator</span>
            </button>
          </div>

          <div className="playground-canvas">
            {activeTab === "dsa" && (
              <div className="canvas-view dsa-view">
                <div className="canvas-left">
                  <div className="question-header-tag">
                    <span className="difficulty easy">Easy</span>
                    <span className="topic-tag">Arrays &amp; Hashing</span>
                  </div>
                  <h3>1. Two Sum Problem</h3>
                  <p>
                    Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.
                  </p>
                  <div className="testcase-preview">
                    <strong>Sample Input:</strong> nums = [2, 7, 11, 15], target = 9<br />
                    <strong>Output:</strong> [0, 1]
                  </div>
                </div>
                <div className="canvas-right">
                  <div className="code-editor-header">
                    <span>Solution.js</span>
                    <span className="lang-tag">JavaScript ES6</span>
                  </div>
                  <pre className="code-editor-body">
                    <code>
                      {`const twoSum = (nums, target) => {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
};`}
                    </code>
                  </pre>
                  <div className="editor-footer">
                    <span className="status-badge-verified">
                      <CheckIcon size={14} color="#D4FF24" />
                      All Test Cases Passed
                    </span>
                    <Link to="/dsa" className="canvas-action-btn">
                      Solve in Full Arena →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sql" && (
              <div className="canvas-view sql-view">
                <div className="canvas-left">
                  <div className="question-header-tag">
                    <span className="difficulty medium">Medium</span>
                    <span className="topic-tag">Window Functions</span>
                  </div>
                  <h3>Department Top Salaries</h3>
                  <p>
                    Find employees who earn the highest salary in each of the departments using window ranking functions.
                  </p>
                  <div className="schema-pill">Table: Employee (id, name, salary, departmentId)</div>
                </div>
                <div className="canvas-right">
                  <div className="code-editor-header">
                    <span>query.sql</span>
                    <span className="lang-tag">PostgreSQL 16</span>
                  </div>
                  <pre className="code-editor-body">
                    <code>
                      {`WITH RankedSalaries AS (
  SELECT 
    d.name AS Department,
    e.name AS Employee,
    e.salary,
    DENSE_RANK() OVER (
      PARTITION BY e.departmentId 
      ORDER BY e.salary DESC
    ) AS rnk
  FROM Employee e
  JOIN Department d ON e.departmentId = d.id
)
SELECT Department, Employee, salary 
FROM RankedSalaries 
WHERE rnk = 1;`}
                    </code>
                  </pre>
                  <div className="editor-footer">
                    <span className="status-badge-verified">
                      <CheckIcon size={14} color="#D4FF24" />
                      Query Output: 5 Rows Returned (12ms)
                    </span>
                    <Link to="/sql" className="canvas-action-btn">
                      Run Live Queries →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "mock" && (
              <div className="canvas-view mock-view">
                <div className="canvas-left">
                  <div className="question-header-tag">
                    <span className="difficulty hard">FAANG Round</span>
                    <span className="topic-tag">System Design &amp; Architecture</span>
                  </div>
                  <h3>Design a Distributed URL Shortener</h3>
                  <p>
                    Evaluate latency, high availability (99.99%), 100M daily writes, custom alias collision handling, and Redis cache strategies.
                  </p>
                  <div className="mock-feedback-score">
                    <div className="score-number">9.4/10</div>
                    <div>
                      <strong>AI Evaluation Verdict</strong>
                      <p>Strong understanding of hashing algorithms and distributed sharding.</p>
                    </div>
                  </div>
                </div>
                <div className="canvas-right mock-interactive">
                  <div className="mock-chat-bubble interviewer">
                    <span className="speaker-tag">AI Interviewer</span>
                    <p>"How do you handle 10,000 concurrent redirect requests during a viral link spike?"</p>
                  </div>
                  <div className="mock-chat-bubble candidate">
                    <span className="speaker-tag">Candidate</span>
                    <p>"By implementing a multi-region Redis cluster with LRU eviction and Cloudflare Edge caching with 301 Permanent Redirect headers."</p>
                  </div>
                  <div className="editor-footer">
                    <span className="status-badge-verified">
                      <CheckIcon size={14} color="#D4FF24" />
                      Feedback: +18 Readiness Points
                    </span>
                    <Link to="/interview" className="canvas-action-btn">
                      Start Mock Session →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="home-section">
        <div className="home-section-heading">
          <span className="section-eyebrow">COMPREHENSIVE CURRICULUM</span>
          <h2>Everything Needed to Land Top Product Offers</h2>
          <p>
            Engineered from ground up to cover each stage of technical campus &amp; off-campus placement pipelines.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-corner-accent" />
            <div className="feature-icon-wrapper">
              <CodeIcon size={24} color="#D4FF24" />
            </div>
            <h3>DSA Practice Engine</h3>
            <p>
              120+ structured DSA challenges categorized by topic and difficulty with integrated test runners and complexity analysis.
            </p>
            <Link to="/dsa" className="feature-card-link">
              <span>Practice DSA</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-corner-accent" />
            <div className="feature-icon-wrapper">
              <DatabaseIcon size={24} color="#1558C9" />
            </div>
            <h3>SQL Query Sandbox</h3>
            <p>
              Practice complex queries with real schema instances. Master Aggregations, Joins, Subqueries, and Window Functions.
            </p>
            <Link to="/sql" className="feature-card-link">
              <span>Practice SQL</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-corner-accent" />
            <div className="feature-icon-wrapper">
              <AssessmentIcon size={24} color="#D4FF24" />
            </div>
            <h3>Timed Assessments</h3>
            <p>
              Simulate actual online coding rounds from top companies with countdown timers, auto-grading, and rank analytics.
            </p>
            <Link to="/assessments" className="feature-card-link">
              <span>Take Assessment</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-corner-accent" />
            <div className="feature-icon-wrapper">
              <InterviewIcon size={24} color="#1558C9" />
            </div>
            <h3>Mock Interviews</h3>
            <p>
              Practice technical, architectural, HR, and behavioral interview questions with structured answer guidelines and rubrics.
            </p>
            <Link to="/interview" className="feature-card-link">
              <span>Practice Interview</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Target Companies Section */}
      <section id="companies" className="companies-home-section">
        <div className="companies-home-content">
          <div className="companies-text">
            <span className="section-eyebrow">TARGETED PREPARATION</span>
            <h2>Prepare for Top Tier Tech Companies</h2>
            <p>
              Explore company-specific interview rounds, exact DSA question patterns, system design questions, and past hiring trends.
            </p>
            <Link
              to={isAuthenticated ? "/companies" : "/register"}
              className="companies-action-button"
            >
              <span>Explore All 45+ Companies</span>
              <ArrowRightIcon size={16} />
            </Link>
          </div>

          <div className="company-cards-grid">
            {companiesList.map((comp) => (
              <div key={comp.name} className="company-box">
                <div className="company-box-top">
                  <div className="company-dot" style={{ backgroundColor: comp.color }} />
                  <strong>{comp.name}</strong>
                </div>
                <div className="company-role">{comp.role}</div>
                <div className="company-tags">
                  <span className="comp-tag diff">{comp.dsaLevel}</span>
                  <span className="comp-tag qcount">{comp.questions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="home-cta-section">
        <div className="cta-card">
          <div className="cta-glow" />
          <div className="cta-content">
            <div className="cta-badge">
              <ZapIcon size={14} color="#030407" />
              <span>READY TO GET PLACED?</span>
            </div>
            <h2>Step Into Your Dream Placement Offer</h2>
            <p>
              Join thousands of aspiring engineers who turned their interview prep into high-paying software engineering offers.
            </p>
            <div className="cta-actions">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="cta-primary-btn"
              >
                <span>{isAuthenticated ? "Launch Dashboard" : "Create Free Account"}</span>
                <ArrowRightIcon size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Obsidian Modern Footer */}
      <footer className="home-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <ZapIcon size={18} color="#030407" />
              <span>PlacementPrep</span>
            </div>
            <p>Next-generation placement preparation system designed for ambitious software engineers.</p>
            <div className="footer-status-pill">
              <span className="pulse-ping" />
              <span>All Systems Operational</span>
            </div>
          </div>

          <div className="footer-links-group">
            <h4>PRACTICE</h4>
            <Link to="/dsa">DSA Problems</Link>
            <Link to="/sql">SQL Challenges</Link>
            <Link to="/assessments">Assessments</Link>
            <Link to="/interview">Mock Interviews</Link>
          </div>

          <div className="footer-links-group">
            <h4>COMPANIES</h4>
            <Link to="/companies">Google Prep</Link>
            <Link to="/companies">Microsoft Prep</Link>
            <Link to="/companies">Amazon Prep</Link>
            <Link to="/companies">Atlassian Prep</Link>
          </div>

          <div className="footer-links-group">
            <h4>PLATFORM</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Account</Link>
            <a href="#features">Features</a>
            <a href="#readiness">Readiness Index</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 PlacementPrep. Built with precision for top-tier software engineering placements.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
