import { useState } from "react"
import { formatMoneyParts } from "./helpers"
import "./App.css"

type Node = {
  id: number
  text: string
}

function App() {
  const [question, setQuestion] = useState("")
  const [answerBullets, setAnswerBullets] = useState<string[]>([])
  const [sourceNodeIds, setSourceNodeIds] = useState<number[]>([])
  const [retrievedNodes, setRetrievedNodes] = useState<Node[]>([])
  const [seenIds, setSeenIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const [model, setModel] = useState("")
  const [cost, setCost] = useState(0)
  const [usage, setUsage] = useState<{ input_tokens: number; output_tokens: number } | null>(null)
  const [sessionCost, setSessionCost] = useState(
    Number(localStorage.getItem("sessionCost") || 0)
  )

  const requestCostParts = formatMoneyParts(cost)
  const sessionCostParts = formatMoneyParts(sessionCost)

  const handleAsk = async () => {
    if (!question.trim()) return

    setLoading(true)
    setAnswerBullets([])
    setSourceNodeIds([])
    setRetrievedNodes([])
    setSeenIds([])

    try {
      const res = await fetch("http://localhost:3334/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      })

      const data = await res.json()

      setModel(data.model || "")
      setCost(data.cost || 0)
      setUsage(data.usage || null)

      const prev = Number(localStorage.getItem("sessionCost") || 0)
      const newTotal = prev + (data.cost || 0)

      localStorage.setItem("sessionCost", newTotal.toString())
      setSessionCost(newTotal)

      setAnswerBullets(data.answerBullets || [])
      setSourceNodeIds(data.sourceNodeIds || [])
      setRetrievedNodes(data.retrievedNodes || [])
      setSeenIds(data.seenIds || [])
    } catch (err) {
      console.error(err)
      setAnswerBullets(["Error contacting server."])
      setSourceNodeIds([])
      setRetrievedNodes([])
      setSeenIds([])
    }

    setLoading(false)
  }

  return (
    <div className="app">
      <div className="card">
        <h1>AI Stazista</h1>
        <p className="subtitle">Simple FE demo for mentor backend</p>

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
          {answerBullets.length === 0 ? (
            <p>No answer yet.</p>
          ) : (
            <ul>
              {answerBullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="answerBox">
          <h2>Source Node IDs</h2>
          <p>{sourceNodeIds.length ? sourceNodeIds.join(", ") : "None"}</p>
        </div>

        <div className="answerBox">
          <h2>Retrieved nodes</h2>
          {retrievedNodes.length === 0 ? (
            <p>No nodes yet.</p>
          ) : (
            <ul>
              {retrievedNodes.map((node) => (
                <li key={node.id}>
                  <strong>Node {node.id}:</strong> {node.text}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="answerBox">
          <h2>Model Info</h2>
          <p>
            <strong>Model:</strong> {model || "Unknown"}
          </p>
          <p>
            <strong>Request cost:</strong>{" "}
            <span>
              {requestCostParts.unit === "$" ? "$" : ""}
              {requestCostParts.main}
              <span style={{ opacity: 0.5, fontSize: "0.85em" }}>
                .{requestCostParts.decimals}
              </span>
              {requestCostParts.unit === "¢" ? "¢" : ""}
            </span>
          </p>

          <p>
            <strong>Total local spend:</strong>{" "}
            <span>
              {sessionCostParts.unit === "$" ? "$" : ""}
              {sessionCostParts.main}
              <span style={{ opacity: 0.5, fontSize: "0.85em" }}>
                .{sessionCostParts.decimals}
              </span>
              {sessionCostParts.unit === "¢" ? "¢" : ""}
            </span>
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("sessionCost")
              setSessionCost(0)
            }}
          >
            Reset Session Cost
          </button>

          {usage && (
            <>
              <p>
                <strong>Input tokens:</strong> {usage.input_tokens}
              </p>
              <p>
                <strong>Output tokens:</strong> {usage.output_tokens}
              </p>
            </>
          )}
        </div>

        <div className="answerBox">
          <h2>Seen IDs</h2>
          <p>{seenIds.length ? seenIds.join(", ") : "None"}</p>
        </div>
      </div>
    </div>
  )
}

export default App