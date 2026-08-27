import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./AdminQuestionDetails.css";

function AdminQuestionDetails() {
	const navigate = useNavigate();
	const { id } = useParams();

	const [question, setQuestion] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchQuestion = async () => {
			try {
				const response = await api.get(`/admin/questions/${id}`);

				console.log("QUESTION DETAIL:", response.data);

				setQuestion(response.data.data);
			} catch (error) {
				console.error("Failed to load question:", error);

				setError(error.response?.data?.message || "Failed to load question");
			} finally {
				setLoading(false);
			}
		};

		fetchQuestion();
	}, [id]);

	if (loading) {
		return (
			<div className="admin-question-details">
				<div className="question-details-loading">Loading question...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="admin-question-details">
				<button type="button" className="question-details-back" onClick={() => navigate("/admin/questions")}>
					← Back to Questions
				</button>

				<div className="question-details-error">{error}</div>
			</div>
		);
	}

	if (!question) {
		return null;
	}

	return (
		<div className="admin-question-details">
			{/* BACK */}

			<button type="button" className="question-details-back" onClick={() => navigate("/admin/questions")}>
				← Back to Questions
			</button>

			{/* HEADER */}

			<div className="question-details-header">
				<div>
					<span className="admin-badge">DSA QUESTION</span>

					<h2>{question.title}</h2>

					<p>Question details and configuration.</p>
				</div>

				<button type="button" className="question-details-edit" onClick={() => navigate(`/admin/questions/${id}/edit`)}>
					Edit Question
				</button>
			</div>

			{/* BASIC INFO */}

			<div className="question-details-card">
				<div className="question-details-card-header">
					<h3>Basic Information</h3>
				</div>

				<div className="question-info-grid">
					<div className="question-info-item">
						<span>Title</span>
						<strong>{question.title}</strong>
					</div>

					<div className="question-info-item">
						<span>Topic</span>
						<strong>{question.topic}</strong>
					</div>

					<div className="question-info-item">
						<span>Difficulty</span>

						<span className={`question-details-difficulty ${question.difficulty?.toLowerCase()}`}>{question.difficulty}</span>
					</div>

					<div className="question-info-item">
						<span>Company Tags</span>

						<div className="question-details-tags">
							{question.companyTags?.length > 0 ? (
								question.companyTags.map((company, index) => <span key={index}>{company}</span>)
							) : (
								<span className="no-tags">General</span>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* DESCRIPTION */}

			<div className="question-details-card">
				<div className="question-details-card-header">
					<h3>Problem Description</h3>
				</div>

				<div className="question-description">{question.description}</div>
			</div>

			{/* EXAMPLES */}

			<div className="question-details-card">
				<div className="question-details-card-header">
					<h3>Examples</h3>

					<span>{question.examples?.length || 0} examples</span>
				</div>

				<div className="question-details-list">
					{question.examples?.length > 0 ? (
						question.examples.map((example, index) => (
							<div className="question-example" key={index}>
								<div className="question-example-title">Example {index + 1}</div>

								<div className="question-example-grid">
									<div>
										<span>Input</span>

										<pre>{example.input}</pre>
									</div>

									<div>
										<span>Output</span>

										<pre>{example.output}</pre>
									</div>
								</div>

								{example.explanation && (
									<div className="question-example-explanation">
										<span>Explanation</span>

										<p>{example.explanation}</p>
									</div>
								)}
							</div>
						))
					) : (
						<div className="question-details-empty">No examples available.</div>
					)}
				</div>
			</div>

			{/* CONSTRAINTS */}

			<div className="question-details-card">
				<div className="question-details-card-header">
					<h3>Constraints</h3>
				</div>

				{question.constraints?.length > 0 ? (
					<ul className="question-constraints">
						{question.constraints.map((constraint, index) => (
							<li key={index}>{constraint}</li>
						))}
					</ul>
				) : (
					<div className="question-details-empty">No constraints available.</div>
				)}
			</div>

			{/* STARTER CODE */}

			<div className="question-details-card">
				<div className="question-details-card-header">
					<h3>Starter Code</h3>
				</div>

				{question.starterCode ? <pre className="question-code">{question.starterCode}</pre> : <div className="question-details-empty">No starter code available.</div>}
			</div>

			{/* TEST CASES */}

			<div className="question-details-card">
				<div className="question-details-card-header">
					<h3>Test Cases</h3>

					<span>{question.testCases?.length || 0} test cases</span>
				</div>

				<div className="question-details-list">
					{question.testCases?.length > 0 ? (
						question.testCases.map((testCase, index) => (
							<div className="question-test-case" key={index}>
								<strong>Test Case {index + 1}</strong>

								<div className="question-test-grid">
									<div>
										<span>Input</span>

										<pre>{testCase.input}</pre>
									</div>

									<div>
										<span>Expected Output</span>

										<pre>{testCase.expectedOutput}</pre>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="question-details-empty">No test cases available.</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default AdminQuestionDetails;
