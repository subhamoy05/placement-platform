import { useEffect, useState } from "react";
import api from "../services/api";

function Interview() {
	const [activeCategory, setActiveCategory] = useState("Technical");

	const [questions, setQuestions] = useState([]);

	const [activeQuestion, setActiveQuestion] = useState(null);

	const [answer, setAnswer] = useState("");

	const [submitted, setSubmitted] = useState(false);

	const [loading, setLoading] = useState(true);

	const [error, setError] = useState("");

	const categories = ["Technical", "HR", "Behavioral", "Company"];

	useEffect(() => {
		const fetchQuestions = async () => {
			setLoading(true);
			setError("");

			try {
				const response = await api.get(`/interview?category=${encodeURIComponent(activeCategory)}`);

				setQuestions(response.data.data.questions || []);
			} catch (err) {
				console.error("Interview questions error:", err);

				setError(err.response?.data?.message || "Failed to load interview questions");

				setQuestions([]);
			} finally {
				setLoading(false);
			}
		};

		fetchQuestions();

		setActiveQuestion(null);
		setAnswer("");
		setSubmitted(false);
	}, [activeCategory]);

	const handlePractice = (index) => {
		setActiveQuestion(index);
		setAnswer("");
		setSubmitted(false);

		setTimeout(() => {
			document.getElementById("answer-section")?.scrollIntoView({
				behavior: "smooth",
			});
		}, 50);
	};

	const handleSubmit = async () => {
		if (!answer.trim()) {
			return;
		}

		const selectedQuestion = questions[activeQuestion];

		if (!selectedQuestion) {
			return;
		}

		setSubmitting(true);
		setError("");
		setSubmitted(false);

		try {
			await api.post("/interview/answers", {
				questionId: selectedQuestion._id,
				answer: answer.trim(),
			});

			setSubmitted(true);
		} catch (err) {
			console.error("Interview answer submission error:", err);

			setError(err.response?.data?.message || "Failed to save your answer");
		} finally {
			setSubmitting(false);
		}
	};

	const handleCategoryChange = (category) => {
		setActiveCategory(category);
	};

	return (
		<div className="interview-page">
			{/* Header */}

			<div className="interview-header">
				<div>
					<h1>Mock Interview</h1>

					<p>Practice common placement interview questions and improve your confidence.</p>
				</div>
			</div>

			<div className="interview-layout">
				{/* Sidebar */}

				<aside className="interview-sidebar">
					<h3>Categories</h3>

					<div className="interview-categories">
						{categories.map((category) => (
							<button key={category} className={activeCategory === category ? "active-category" : ""} onClick={() => handleCategoryChange(category)}>
								{category}
							</button>
						))}
					</div>
				</aside>

				{/* Content */}

				<main className="interview-content">
					<div className="interview-content-header">
						<div>
							<h2>{activeCategory} Questions</h2>

							{!loading && <p>{questions.length} questions</p>}
						</div>
					</div>

					{/* Loading */}

					{loading && (
						<div className="empty-state">
							<p>Loading interview questions...</p>
						</div>
					)}

					{/* Error */}

					{!loading && error && (
						<div className="empty-state">
							<p>{error}</p>
						</div>
					)}

					{/* Empty */}

					{!loading && !error && questions.length === 0 && (
						<div className="empty-state">
							<p>No questions available for {activeCategory}.</p>
						</div>
					)}

					{/* Questions */}

					{!loading && !error && questions.length > 0 && (
						<div className="interview-question-list">
							{questions.map((item, index) => (
								<div className="interview-question-card" key={item._id}>
									<div className="interview-question-top">
										<span>Question {index + 1}</span>

										<span className={`interview-level ${String(item.level || "Easy").toLowerCase()}`}>{item.level}</span>
									</div>

									<h3>{item.question}</h3>

									{item.topic && <p className="interview-topic">Topic: {item.topic}</p>}

									{item.company && <p className="interview-topic">Company: {item.company}</p>}

									<button className="practice-button" onClick={() => handlePractice(index)}>
										Practice Answer
									</button>
								</div>
							))}
						</div>
					)}

					{/* Answer */}

					{activeQuestion !== null && questions[activeQuestion] && (
						<section id="answer-section" className="interview-answer-card">
							<div className="answer-card-header">
								<div>
									<span>{activeCategory} Interview</span>

									<h2>Your Answer</h2>
								</div>

								<button
									className="close-answer-button"
									onClick={() => {
										setActiveQuestion(null);
										setAnswer("");
										setSubmitted(false);
									}}
								>
									✕
								</button>
							</div>

							<div className="selected-question">
								<strong>Question:</strong>

								<p>{questions[activeQuestion].question}</p>
							</div>

							<textarea
								className="interview-answer-input"
								value={answer}
								onChange={(event) => setAnswer(event.target.value)}
								placeholder="Type your answer here..."
							/>

							<div className="answer-footer">
								<span>{answer.length} characters</span>

								<button className="submit-answer-button" onClick={handleSubmit} disabled={!answer.trim() || submitting}>
									{submitting ? "Saving..." : "Submit Answer"}
								</button>
							</div>

							{submitted && (
								<div className="self-review-box">
									<h3>Answer Saved ✓</h3>

									<p>Your answer has been saved successfully. AI evaluation will be added in a later step.</p>
								</div>
							)}
						</section>
					)}
				</main>
			</div>
		</div>
	);
}

export default Interview;
