import { useState } from "react"
import "./App.css"

function App() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return

    setLoading(true)

    try {
      const res = await fetch("http://localhost:3334/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      })

      const data = await res.json()

      setAnswer(data.answer)
    } catch (err) {
      console.error(err)
      setAnswer("Error contacting server.")
    }

    setLoading(false)
  }
  
  return (
    <div className="app">
      <div className="card">
        <h1>AI Stazista</h1>
        <p className="subtitle">Simple FE demo for MCP-powered Q&A</p>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          rows={5}
        />

        <button onClick={handleAsk} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>

        <div className="answerBox">
          <h2>Answer</h2>
          <p>{answer || "No answer yet."}</p>
        </div>
      </div>
    </div>
  )
}

export default App