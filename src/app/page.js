"use client"
import EquationInput from "@/components/EquationInput"
import Visualization from "@/components/Visualization"
import { useState } from "react"

export default function MainPage() {
  const [equationResult, setEquationResult] = useState(null)

  const handleEquationSubmit = async (equationData) => {
    // Logique pour envoyer l'équation à l'API et recevoir le résultat
    // Exemple :
    // const result = await fetch('/api/equation', { method: 'POST', body: JSON.stringify(equationData) });
    // setEquationResult(await result.json());
    console.log(equationData)
  }

  return (
    <div>
      <section className="p-4 border border-gray-200 rounded-lg">
        <EquationInput onEquationSubmit={handleEquationSubmit} />
      </section>
      <Visualization
        data={equationResult}
        equation={`y'-a*x*y+y^e=5-x^2`}
      />
    </div>
  )
}
