import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./AdminQuestionCreate.css";

const topics = ["Array", "String", "Linked List", "Stack", "Queue", "Hashing", "Searching", "Sorting", "Tree", "Graph", "Greedy", "Dynamic Programming", "Recursion"];

const difficulties = ["Easy", "Medium", "Hard"];

function AdminQuestionCreate() {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		title: "",
		description: "",
		topic: "Array",
		difficulty: "Easy",
		starterCode: "",
		companyTags: "",
	});

	const [examples, setExamples] = useState([
		{
			input: "",
			output: "",
			explanation: "",
		},
	]);

	const [constraints, setConstraints] = useState([""]);

	const [testCases, setTestCases] = useState([
		{
			input: "",
			expectedOutput: "",
		},
	]);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	/* ================================
       BASIC FORM
    ================================= */

	const handleChange = (e) => {
		const { name, value } = e.target;

		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	/* ================================
       EXAMPLES
    ================================= */

	const handleExampleChange = (index, field, value) => {
		setExamples((prev) =>
			prev.map((example, i) =>
				i === index
					? {
							...example,
							[field]: value,
						}
					: example,
			),
		);
	};

	const addExample = () => {
		setExamples((prev) => [
			...prev,
			{
				input: "",
				output: "",
				explanation: "",
			},
		]);
	};

	const removeExample = (index) => {
		if (examples.length === 1) return;

		setExamples((prev) => prev.filter((_, i) => i !== index));
	};

	/* ================================
       CONSTRAINTS
    ================================= */

	const handleConstraintChange = (index, value) => {
		setConstraints((prev) => prev.map((constraint, i) => (i === index ? value : constraint)));
	};

	const addConstraint = () => {
		setConstraints((prev) => [...prev, ""]);
	};

	const removeConstraint = (index) => {
		if (constraints.length === 1) return;

		setConstraints((prev) => prev.filter((_, i) => i !== index));
	};

	/* ================================
       TEST CASES
    ================================= */

	const handleTestCaseChange = (index, field, value) => {
		setTestCases((prev) =>
			prev.map((testCase, i) =>
				i === index
					? {
							...testCase,
							[field]: value,
						}
					: testCase,
			),
		);
	};

	const addTestCase = () => {
		setTestCases((prev) => [
			...prev,
			{
				input: "",
				expectedOutput: "",
			},
		]);
	};

	const removeTestCase = (index) => {
		if (testCases.length === 1) return;

		setTestCases((prev) => prev.filter((_, i) => i !== index));
	};

	/* ================================
       SUBMIT
    ================================= */

	const handleSubmit = async (e) => {
		e.preventDefault();

		setError("");

		if (!form.title.trim()) {
			setError("Question title is required.");
			return;
		}

		if (!form.description.trim()) {
			setError("Question description is required.");
			return;
		}

		if (examples.some((example) => !example.input.trim() || !example.output.trim())) {
			setError("Please complete all example input and output fields.");
			return;
		}

		if (testCases.some((testCase) => !testCase.input.trim() || !testCase.expectedOutput.trim())) {
			setError("Please complete all test cases.");
			return;
		}

		setLoading(true);

		try {
			const payload = {
				title: form.title.trim(),
				description: form.description.trim(),
				topic: form.topic,
				difficulty: form.difficulty,

				examples: examples.map((example) => ({
					input: example.input.trim(),
					output: example.output.trim(),
					explanation: example.explanation.trim(),
				})),

				constraints: constraints.map((constraint) => constraint.trim()).filter(Boolean),

				starterCode: form.starterCode,

				testCases: testCases.map((testCase) => ({
					input: testCase.input.trim(),
					expectedOutput: testCase.expectedOutput.trim(),
				})),

				companyTags: form.companyTags
					.split(",")
					.map((company) => company.trim())
					.filter(Boolean),
			};

			const response = await api.post("/admin/questions", payload);

			console.log("CREATE STATUS:", response.status);

			console.log("CREATE RESPONSE:", response.data);

			navigate("/admin/questions");
		} catch (error) {
			console.error("Failed to create question:", error);

			setError(error.response?.data?.message || "Failed to create question.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="admin-question-create">
			{/* BACK */}

			<button type="button" className="question-create-back" onClick={() => navigate("/admin/questions")}>
				← Back to Questions
			</button>

			{/* HEADER */}

			<div className="question-create-header">
				<div>
					<span className="admin-badge">DSA QUESTIONS</span>

					<h2>Create New Question</h2>

					<p>Add a coding question for placement preparation.</p>
				</div>
			</div>

			{/* FORM */}

			<form className="question-create-form" onSubmit={handleSubmit}>
				{/* BASIC INFORMATION */}

				<section className="question-form-section">
					<div className="section-heading">
						<h3>Basic Information</h3>

						<p>Define the question and its difficulty.</p>
					</div>

					<div className="form-grid">
						<div className="form-group full">
							<label>Question Title</label>

							<input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Two Sum" />
						</div>

						<div className="form-group full">
							<label>Description</label>

							<textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the problem..." rows="6" />
						</div>

						<div className="form-group">
							<label>Topic</label>

							<select name="topic" value={form.topic} onChange={handleChange}>
								{topics.map((topic) => (
									<option key={topic} value={topic}>
										{topic}
									</option>
								))}
							</select>
						</div>

						<div className="form-group">
							<label>Difficulty</label>

							<select name="difficulty" value={form.difficulty} onChange={handleChange}>
								{difficulties.map((difficulty) => (
									<option key={difficulty} value={difficulty}>
										{difficulty}
									</option>
								))}
							</select>
						</div>
					</div>
				</section>

				{/* EXAMPLES */}

				<section className="question-form-section">
					<div className="section-heading-row">
						<div>
							<h3>Examples</h3>

							<p>Add sample inputs and outputs.</p>
						</div>

						<button type="button" className="secondary-add-btn" onClick={addExample}>
							+ Add Example
						</button>
					</div>

					<div className="dynamic-list">
						{examples.map((example, index) => (
							<div className="dynamic-item" key={index}>
								<div className="dynamic-item-header">
									<strong>Example {index + 1}</strong>

									{examples.length > 1 && (
										<button type="button" className="remove-btn" onClick={() => removeExample(index)}>
											Remove
										</button>
									)}
								</div>

								<div className="form-grid">
									<div className="form-group">
										<label>Input</label>

										<textarea
											value={example.input}
											onChange={(e) => handleExampleChange(index, "input", e.target.value)}
											placeholder="nums = [2,7,11,15], target = 9"
											rows="3"
										/>
									</div>

									<div className="form-group">
										<label>Output</label>

										<textarea value={example.output} onChange={(e) => handleExampleChange(index, "output", e.target.value)} placeholder="[0,1]" rows="3" />
									</div>

									<div className="form-group full">
										<label>Explanation</label>

										<textarea
											value={example.explanation}
											onChange={(e) => handleExampleChange(index, "explanation", e.target.value)}
											placeholder="Explain why this output is correct..."
											rows="3"
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* CONSTRAINTS */}

				<section className="question-form-section">
					<div className="section-heading-row">
						<div>
							<h3>Constraints</h3>

							<p>Add the rules and limits for the problem.</p>
						</div>

						<button type="button" className="secondary-add-btn" onClick={addConstraint}>
							+ Add Constraint
						</button>
					</div>

					<div className="constraint-list">
						{constraints.map((constraint, index) => (
							<div className="constraint-row" key={index}>
								<span>{index + 1}</span>

								<input
									type="text"
									value={constraint}
									onChange={(e) => handleConstraintChange(index, e.target.value)}
									placeholder="e.g. 2 <= nums.length <= 10000"
								/>

								{constraints.length > 1 && (
									<button type="button" className="remove-btn" onClick={() => removeConstraint(index)}>
										Remove
									</button>
								)}
							</div>
						))}
					</div>
				</section>

				{/* STARTER CODE */}

				<section className="question-form-section">
					<div className="section-heading">
						<h3>Starter Code</h3>

						<p>Optional code shown to students.</p>
					</div>

					<div className="form-group">
						<textarea
							className="code-input"
							name="starterCode"
							value={form.starterCode}
							onChange={handleChange}
							placeholder={`function twoSum(nums, target) {
    // Write your solution here
}`}
							rows="10"
						/>
					</div>
				</section>

				{/* TEST CASES */}

				<section className="question-form-section">
					<div className="section-heading-row">
						<div>
							<h3>Test Cases</h3>

							<p>Define inputs and expected outputs.</p>
						</div>

						<button type="button" className="secondary-add-btn" onClick={addTestCase}>
							+ Add Test Case
						</button>
					</div>

					<div className="dynamic-list">
						{testCases.map((testCase, index) => (
							<div className="dynamic-item" key={index}>
								<div className="dynamic-item-header">
									<strong>Test Case {index + 1}</strong>

									{testCases.length > 1 && (
										<button type="button" className="remove-btn" onClick={() => removeTestCase(index)}>
											Remove
										</button>
									)}
								</div>

								<div className="form-grid">
									<div className="form-group">
										<label>Input</label>

										<textarea
											value={testCase.input}
											onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
											placeholder="nums = [2,7,11,15], target = 9"
											rows="3"
										/>
									</div>

									<div className="form-group">
										<label>Expected Output</label>

										<textarea
											value={testCase.expectedOutput}
											onChange={(e) => handleTestCaseChange(index, "expectedOutput", e.target.value)}
											placeholder="[0,1]"
											rows="3"
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* COMPANY TAGS */}

				<section className="question-form-section">
					<div className="section-heading">
						<h3>Company Tags</h3>

						<p>Separate company names using commas.</p>
					</div>

					<div className="form-group">
						<input type="text" name="companyTags" value={form.companyTags} onChange={handleChange} placeholder="Google, Amazon, Microsoft" />
					</div>
				</section>

				{/* ERROR */}

				{error && <div className="question-form-error">{error}</div>}

				{/* ACTIONS */}

				<div className="question-form-actions">
					<button type="button" className="cancel-question-btn" onClick={() => navigate("/admin/questions")} disabled={loading}>
						Cancel
					</button>

					<button type="submit" className="save-question-btn" disabled={loading}>
						{loading ? "Creating..." : "Create Question"}
					</button>
				</div>
			</form>
		</div>
	);
}

export default AdminQuestionCreate;
