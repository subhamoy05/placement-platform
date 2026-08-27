import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./AdminQuestionEdit.css";

const topics = [
    "Array",
    "String",
    "Linked List",
    "Stack",
    "Queue",
    "Hashing",
    "Searching",
    "Sorting",
    "Tree",
    "Graph",
    "Greedy",
    "Dynamic Programming",
    "Recursion",
];

const difficulties = ["Easy", "Medium", "Hard"];

const emptyExample = {
    input: "",
    output: "",
    explanation: "",
};

const emptyTestCase = {
    input: "",
    expectedOutput: "",
};

function AdminQuestionEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        title: "",
        description: "",
        topic: "Array",
        difficulty: "Easy",
        starterCode: "",
        companyTags: "",
    });

    const [examples, setExamples] = useState([
        { ...emptyExample },
    ]);

    const [constraints, setConstraints] = useState([
        "",
    ]);

    const [testCases, setTestCases] = useState([
        { ...emptyTestCase },
    ]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    /* =================================
       LOAD QUESTION
    ================================= */

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await api.get(
                    `/admin/questions/${id}`
                );

                console.log(
                    "EDIT QUESTION:",
                    response.data
                );

                const question =
                    response.data.data;

                if (!question) {
                    setError(
                        "Question not found."
                    );
                    return;
                }

                setForm({
                    title: question.title || "",
                    description:
                        question.description || "",
                    topic:
                        question.topic || "Array",
                    difficulty:
                        question.difficulty ||
                        "Easy",
                    starterCode:
                        question.starterCode || "",
                    companyTags:
                        Array.isArray(
                            question.companyTags
                        )
                            ? question.companyTags.join(
                                  ", "
                              )
                            : "",
                });

                setExamples(
                    question.examples?.length
                        ? question.examples.map(
                              (example) => ({
                                  input:
                                      example.input ||
                                      "",
                                  output:
                                      example.output ||
                                      "",
                                  explanation:
                                      example.explanation ||
                                      "",
                              })
                          )
                        : [{ ...emptyExample }]
                );

                setConstraints(
                    question.constraints?.length
                        ? question.constraints
                        : [""]
                );

                setTestCases(
                    question.testCases?.length
                        ? question.testCases.map(
                              (testCase) => ({
                                  input:
                                      testCase.input ||
                                      "",
                                  expectedOutput:
                                      testCase.expectedOutput ||
                                      "",
                              })
                          )
                        : [{ ...emptyTestCase }]
                );
            } catch (error) {
                console.error(
                    "Failed to load question:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                        "Failed to load question."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    /* =================================
       BASIC FORM
    ================================= */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =================================
       EXAMPLES
    ================================= */

    const handleExampleChange = (
        index,
        field,
        value
    ) => {
        setExamples((prev) =>
            prev.map((example, i) =>
                i === index
                    ? {
                          ...example,
                          [field]: value,
                      }
                    : example
            )
        );
    };

    const addExample = () => {
        setExamples((prev) => [
            ...prev,
            { ...emptyExample },
        ]);
    };

    const removeExample = (index) => {
        if (examples.length === 1) return;

        setExamples((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    /* =================================
       CONSTRAINTS
    ================================= */

    const handleConstraintChange = (
        index,
        value
    ) => {
        setConstraints((prev) =>
            prev.map((constraint, i) =>
                i === index
                    ? value
                    : constraint
            )
        );
    };

    const addConstraint = () => {
        setConstraints((prev) => [
            ...prev,
            "",
        ]);
    };

    const removeConstraint = (index) => {
        if (constraints.length === 1) return;

        setConstraints((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    /* =================================
       TEST CASES
    ================================= */

    const handleTestCaseChange = (
        index,
        field,
        value
    ) => {
        setTestCases((prev) =>
            prev.map((testCase, i) =>
                i === index
                    ? {
                          ...testCase,
                          [field]: value,
                      }
                    : testCase
            )
        );
    };

    const addTestCase = () => {
        setTestCases((prev) => [
            ...prev,
            { ...emptyTestCase },
        ]);
    };

    const removeTestCase = (index) => {
        if (testCases.length === 1) return;

        setTestCases((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    /* =================================
       SAVE
    ================================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!form.title.trim()) {
            setError(
                "Question title is required."
            );
            return;
        }

        if (!form.description.trim()) {
            setError(
                "Question description is required."
            );
            return;
        }

        if (
            examples.some(
                (example) =>
                    !example.input.trim() ||
                    !example.output.trim()
            )
        ) {
            setError(
                "Please complete all example input and output fields."
            );
            return;
        }

        if (
            testCases.some(
                (testCase) =>
                    !testCase.input.trim() ||
                    !testCase.expectedOutput.trim()
            )
        ) {
            setError(
                "Please complete all test cases."
            );
            return;
        }

        const payload = {
            title: form.title.trim(),

            description:
                form.description.trim(),

            topic: form.topic,

            difficulty: form.difficulty,

            examples: examples.map(
                (example) => ({
                    input: example.input.trim(),
                    output:
                        example.output.trim(),
                    explanation:
                        example.explanation.trim(),
                })
            ),

            constraints: constraints
                .map((constraint) =>
                    constraint.trim()
                )
                .filter(Boolean),

            starterCode:
                form.starterCode,

            testCases: testCases.map(
                (testCase) => ({
                    input:
                        testCase.input.trim(),
                    expectedOutput:
                        testCase.expectedOutput.trim(),
                })
            ),

            companyTags:
                form.companyTags
                    .split(",")
                    .map((company) =>
                        company.trim()
                    )
                    .filter(Boolean),
        };

        setSaving(true);

        try {
            const response = await api.put(
                `/admin/questions/${id}`,
                payload
            );

            console.log(
                "UPDATE STATUS:",
                response.status
            );

            console.log(
                "UPDATE RESPONSE:",
                response.data
            );

            navigate(
                `/admin/questions/${id}`
            );
        } catch (error) {
            console.error(
                "Failed to update question:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to update question."
            );
        } finally {
            setSaving(false);
        }
    };

    /* =================================
       LOADING
    ================================= */

    if (loading) {
        return (
            <div className="admin-question-edit">
                <div className="question-edit-loading">
                    Loading question...
                </div>
            </div>
        );
    }

    /* =================================
       ERROR
    ================================= */

    if (error && !form.title) {
        return (
            <div className="admin-question-edit">

                <button
                    type="button"
                    className="question-edit-back"
                    onClick={() =>
                        navigate(
                            "/admin/questions"
                        )
                    }
                >
                    ← Back to Questions
                </button>

                <div className="question-edit-error">
                    {error}
                </div>

            </div>
        );
    }

    return (
        <div className="admin-question-edit">

            {/* BACK */}

            <button
                type="button"
                className="question-edit-back"
                onClick={() =>
                    navigate(
                        `/admin/questions/${id}`
                    )
                }
            >
                ← Back to Question
            </button>

            {/* HEADER */}

            <div className="question-edit-header">
                <div>
                    <span className="admin-badge">
                        DSA QUESTIONS
                    </span>

                    <h2>
                        Edit Question
                    </h2>

                    <p>
                        Update the question,
                        examples and test cases.
                    </p>
                </div>
            </div>

            {/* FORM */}

            <form
                className="question-edit-form"
                onSubmit={handleSubmit}
            >

                {/* BASIC */}

                <section className="question-edit-section">

                    <div className="edit-section-heading">
                        <h3>
                            Basic Information
                        </h3>

                        <p>
                            Update the question
                            information.
                        </p>
                    </div>

                    <div className="edit-form-grid">

                        <div className="edit-form-group full">
                            <label>
                                Question Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="edit-form-group full">
                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={handleChange}
                                rows="7"
                            />
                        </div>

                        <div className="edit-form-group">
                            <label>
                                Topic
                            </label>

                            <select
                                name="topic"
                                value={form.topic}
                                onChange={handleChange}
                            >
                                {topics.map(
                                    (topic) => (
                                        <option
                                            key={topic}
                                            value={topic}
                                        >
                                            {topic}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="edit-form-group">
                            <label>
                                Difficulty
                            </label>

                            <select
                                name="difficulty"
                                value={
                                    form.difficulty
                                }
                                onChange={handleChange}
                            >
                                {difficulties.map(
                                    (difficulty) => (
                                        <option
                                            key={
                                                difficulty
                                            }
                                            value={
                                                difficulty
                                            }
                                        >
                                            {difficulty}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                    </div>

                </section>

                {/* EXAMPLES */}

                <section className="question-edit-section">

                    <div className="edit-section-heading-row">

                        <div>
                            <h3>
                                Examples
                            </h3>

                            <p>
                                Update sample
                                inputs and outputs.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="edit-secondary-btn"
                            onClick={addExample}
                        >
                            + Add Example
                        </button>

                    </div>

                    <div className="edit-dynamic-list">

                        {examples.map(
                            (
                                example,
                                index
                            ) => (
                                <div
                                    className="edit-dynamic-item"
                                    key={index}
                                >

                                    <div className="edit-dynamic-header">

                                        <strong>
                                            Example{" "}
                                            {index + 1}
                                        </strong>

                                        {examples.length >
                                            1 && (
                                            <button
                                                type="button"
                                                className="edit-remove-btn"
                                                onClick={() =>
                                                    removeExample(
                                                        index
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>
                                        )}

                                    </div>

                                    <div className="edit-form-grid">

                                        <div className="edit-form-group">
                                            <label>
                                                Input
                                            </label>

                                            <textarea
                                                value={
                                                    example.input
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleExampleChange(
                                                        index,
                                                        "input",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                rows="4"
                                            />
                                        </div>

                                        <div className="edit-form-group">
                                            <label>
                                                Output
                                            </label>

                                            <textarea
                                                value={
                                                    example.output
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleExampleChange(
                                                        index,
                                                        "output",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                rows="4"
                                            />
                                        </div>

                                        <div className="edit-form-group full">
                                            <label>
                                                Explanation
                                            </label>

                                            <textarea
                                                value={
                                                    example.explanation
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleExampleChange(
                                                        index,
                                                        "explanation",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                rows="4"
                                            />
                                        </div>

                                    </div>

                                </div>
                            )
                        )}

                    </div>

                </section>

                {/* CONSTRAINTS */}

                <section className="question-edit-section">

                    <div className="edit-section-heading-row">

                        <div>
                            <h3>
                                Constraints
                            </h3>

                            <p>
                                Update problem
                                constraints.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="edit-secondary-btn"
                            onClick={
                                addConstraint
                            }
                        >
                            + Add Constraint
                        </button>

                    </div>

                    <div className="edit-constraint-list">

                        {constraints.map(
                            (
                                constraint,
                                index
                            ) => (
                                <div
                                    className="edit-constraint-row"
                                    key={index}
                                >

                                    <span>
                                        {index + 1}
                                    </span>

                                    <input
                                        type="text"
                                        value={
                                            constraint
                                        }
                                        onChange={(e) =>
                                            handleConstraintChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />

                                    {constraints.length >
                                        1 && (
                                        <button
                                            type="button"
                                            className="edit-remove-btn"
                                            onClick={() =>
                                                removeConstraint(
                                                    index
                                                )
                                            }
                                        >
                                            Remove
                                        </button>
                                    )}

                                </div>
                            )
                        )}

                    </div>

                </section>

                {/* STARTER CODE */}

                <section className="question-edit-section">

                    <div className="edit-section-heading">
                        <h3>
                            Starter Code
                        </h3>

                        <p>
                            Update optional starter
                            code.
                        </p>
                    </div>

                    <div className="edit-form-group">

                        <textarea
                            className="edit-code-input"
                            name="starterCode"
                            value={
                                form.starterCode
                            }
                            onChange={handleChange}
                            rows="12"
                        />

                    </div>

                </section>

                {/* TEST CASES */}

                <section className="question-edit-section">

                    <div className="edit-section-heading-row">

                        <div>
                            <h3>
                                Test Cases
                            </h3>

                            <p>
                                Update inputs and
                                expected outputs.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="edit-secondary-btn"
                            onClick={
                                addTestCase
                            }
                        >
                            + Add Test Case
                        </button>

                    </div>

                    <div className="edit-dynamic-list">

                        {testCases.map(
                            (
                                testCase,
                                index
                            ) => (
                                <div
                                    className="edit-dynamic-item"
                                    key={index}
                                >

                                    <div className="edit-dynamic-header">

                                        <strong>
                                            Test Case{" "}
                                            {index + 1}
                                        </strong>

                                        {testCases.length >
                                            1 && (
                                            <button
                                                type="button"
                                                className="edit-remove-btn"
                                                onClick={() =>
                                                    removeTestCase(
                                                        index
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>
                                        )}

                                    </div>

                                    <div className="edit-form-grid">

                                        <div className="edit-form-group">
                                            <label>
                                                Input
                                            </label>

                                            <textarea
                                                value={
                                                    testCase.input
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleTestCaseChange(
                                                        index,
                                                        "input",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                rows="4"
                                            />
                                        </div>

                                        <div className="edit-form-group">
                                            <label>
                                                Expected Output
                                            </label>

                                            <textarea
                                                value={
                                                    testCase.expectedOutput
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleTestCaseChange(
                                                        index,
                                                        "expectedOutput",
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                rows="4"
                                            />
                                        </div>

                                    </div>

                                </div>
                            )
                        )}

                    </div>

                </section>

                {/* COMPANY TAGS */}

                <section className="question-edit-section">

                    <div className="edit-section-heading">
                        <h3>
                            Company Tags
                        </h3>

                        <p>
                            Separate company names
                            with commas.
                        </p>
                    </div>

                    <div className="edit-form-group">

                        <input
                            type="text"
                            name="companyTags"
                            value={
                                form.companyTags
                            }
                            onChange={handleChange}
                            placeholder="Google, Amazon, Microsoft"
                        />

                    </div>

                </section>

                {/* ERROR */}

                {error && (
                    <div className="question-edit-error">
                        {error}
                    </div>
                )}

                {/* ACTIONS */}

                <div className="question-edit-actions">

                    <button
                        type="button"
                        className="question-edit-cancel"
                        onClick={() =>
                            navigate(
                                `/admin/questions/${id}`
                            )
                        }
                        disabled={saving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="question-edit-save"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default AdminQuestionEdit;