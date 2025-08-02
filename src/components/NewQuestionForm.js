import React, { useState } from "react";

function NewQuestionForm({ onAddQuestion }) {
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  function handleAnswerChange(index, value) {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newQuestion = {
      prompt,
      answers,
      correctIndex: parseInt(correctIndex)
    };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion)
    })
      .then((r) => r.json())
      .then((data) => {
        onAddQuestion(data);
        setPrompt("");
        setAnswers(["", "", "", ""]);
        setCorrectIndex(0);
      });
  }

  return (
    <section>
      <h2>New Question</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Prompt</label>
        <input
          id="prompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <br />

        {answers.map((answer, index) => (
          <div key={index}>
            <label htmlFor={`answer-${index}`}>Answer {index + 1}</label>
            <input
              id={`answer-${index}`}
              type="text"
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              required
            />
          </div>
        ))}

        <br />
        <label htmlFor="correct">Correct Answer</label>
        <select
          id="correct"
          value={correctIndex}
          onChange={(e) => setCorrectIndex(e.target.value)}
        >
          {answers.map((_, index) => (
            <option key={index} value={index}>
              {`Answer ${index + 1}`}
            </option>
          ))}
        </select>
        <br />

        <button type="submit">Add Question</button>
      </form>
    </section>
  );
}

export default NewQuestionForm;
