import { useState } from "react"
import "./App.css"

function App() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return

    setLoading(true)

    // zatial len fake answer, backend napojime neskor
    setTimeout(() => {
      setAnswer(`Demo answer for: ${question}`)
      setLoading(false)
    }, 700)
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