// src/__tests__/App.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'; // ✅ ADD THIS LINE
import App from "../components/App";

// Mock fetch to simulate API data
beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (!options) {
      // Initial GET request
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            id: 1,
            prompt: "lorem testum 1",
            answers: ["choice 1", "choice 2", "choice 3", "choice 4"],
            correctIndex: 0,
          },
          {
            id: 2,
            prompt: "lorem testum 2",
            answers: ["a", "b", "c", "d"],
            correctIndex: 2,
          },
        ]),
      });
    } else if (options.method === "POST") {
      // New question creation
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 3,
          prompt: "Test Prompt",
          answers: ["A", "B", "C", "D"],
          correctIndex: 2,
        }),
      });
    } else if (options.method === "DELETE") {
      // Simulate successful deletion
      return Promise.resolve({ ok: true });
    } else if (options.method === "PATCH") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 1,
          prompt: "lorem testum 1",
          answers: ["choice 1", "choice 2", "choice 3", "choice 4"],
          correctIndex: 2, // updated value
        }),
      });
    }
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

test("displays question prompts after fetching", async () => {
  render(<App />);
  expect(await screen.findByText(/lorem testum 1/i)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/i)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText(/Prompt/i), {
    target: { value: "Test Prompt" },
  });

  fireEvent.change(screen.getByLabelText(/Answer 1/i), {
    target: { value: "A" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 2/i), {
    target: { value: "B" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 3/i), {
    target: { value: "C" },
  });
  fireEvent.change(screen.getByLabelText(/Answer 4/i), {
    target: { value: "D" },
  });

  fireEvent.change(screen.getByLabelText(/Correct Answer/i), {
    target: { value: "2" },
  });

  fireEvent.click(screen.getByText(/Add Question/i));

  await waitFor(() => {
    expect(screen.getByText(/Test Prompt/i)).toBeInTheDocument();
  });
});

test("deletes the question when the delete button is clicked", async () => {
  render(<App />);

  const question = await screen.findByText(/lorem testum 1/i);
  expect(question).toBeInTheDocument();

  const deleteButton = screen.getAllByText("Delete Question")[0];
  fireEvent.click(deleteButton);

  await waitFor(() => {
    expect(screen.queryByText(/lorem testum 1/i)).not.toBeInTheDocument();
  });
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);

  const dropdown = await screen.findByDisplayValue("choice 1");
  fireEvent.change(dropdown, { target: { value: "2" } });

  await waitFor(() => {
    expect(dropdown.value).toBe("2");
  });
});
