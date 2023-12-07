"use client"

import { useState } from "react"
import ParameterInput from "./ParameterInput" // Assurez-vous que le chemin d'importation est correct

export default function EquationInput({ onEquationSubmit }) {
  const [equation, setEquation] = useState("")
  const [parameters, setParameters] = useState({})

  const handleEquationChange = (newEquation) => {
    setEquation(newEquation)
  }

  const handleParametersChange = (newParameters) => {
    setParameters(newParameters)
  }
  const handleSubmit = () => {
    const data = {
      Equation: equation ? equation : "y'-2*x*y+y^2=5-x^2",
      Parameter: parameters,
    }

    onEquationSubmit(data)
  }

  return (
    <div>
      <ParameterInput onParametersChange={handleParametersChange} />
      <div className="flex m-auto mt-2 w-3/4">
        <input
          type="text"
          name="equation"
          id="equation"
          value={equation}
          onChange={(e) => handleEquationChange(e.target.value)}
          className="w-full p-3 bg-blue-100 border-2 border-blue-500 shadow-sm focus:border-blue-500 sm:text-sm rounded-l-lg "
          placeholder="y'-2*x*y+y^2=5-x^2"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 p-2 text-white rounded-r-lg block w-1/4">
          =
        </button>
      </div>
    </div>
  )
}
