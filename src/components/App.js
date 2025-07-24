// src/App.js
import React, { useState, useEffect } from "react";
import NewQuestionForm from "./components/NewQuestionForm";
import QuestionList from "./components/QuestionList";

function App() {
  const [questions, setQuestions] = useState([]);

  // Fetch questions on load
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then((data) => setQuestions(data));
  }, []);

  // Add new question
  function handleAddQuestion(newQuestion) {
    setQuestions([...questions, newQuestion]);
  }

  // Delete a question by id
  function handleDeleteQuestion(deletedId) {
    setQuestions(questions.filter((q) => q.id !== deletedId));
  }

  // Update a question’s correct index
  function handleUpdateQuestion(updatedQuestion) {
    const updatedList = questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setQuestions(updatedList);
  }

  return (
    <main>
      <h1>Quiz Admin Panel</h1>
      <NewQuestionForm onAddQuestion={handleAddQuestion} />
      <QuestionList
        questions={questions}
        onDelete={handleDeleteQuestion}
        onUpdate={handleUpdateQuestion}
      />
    </main>
  );
}

export default App;
