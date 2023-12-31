"use client"
import EquationInput from "@/components/EquationInput"
import Visualization from "@/components/Visualization"
import { useState } from "react"

export default function MainPage() {
  const [equationResult, setEquationResult] = useState({
    solution: "",
    latex: "",
    graphdata: [],
  })

  const handleEquationSubmit = async (equationData) => {
    try {
      const response = await fetch("http://localhost:3000/api/solver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equationData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setEquationResult(result)
    } catch (e) {
      console.error("There was a problem with the fetch operation:", e)
    }
  }

  return (
    <div>
      <section className="p-4 border border-gray-200 rounded-lg">
        <EquationInput onEquationSubmit={handleEquationSubmit} />
      </section>
      <Visualization
        data={equationResult.graphdata}
        equation={equationResult.latex}
      />
    </div>
  )
}
