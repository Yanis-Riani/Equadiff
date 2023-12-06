"use client"

import { useState } from "react"

export default function ParameterInput({ onParametersChange }) {
  const [order, setOrder] = useState("first")
  const [initialCondition, setInitialCondition] = useState("")
  const [secondInitialCondition, setSecondInitialCondition] = useState("")
  const [functionName, setFunctionName] = useState("y")
  const [variables, setVariables] = useState([{ name: "", value: "" }])
  const [parameters, setParameters] = useState({
    functionName: functionName,
    t_span: [0, 10],
    t_eval: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 10],
  })

  const updateParameters = (newParams) => {
    const updatedParameters = { ...parameters, ...newParams }
    setParameters(updatedParameters)
    onParametersChange(updatedParameters)
  }

  const handleOrderChange = (event) => {
    setOrder(event.target.value)
    onParametersChange({ ...parameters, order: event.target.value })
  }

  const handleVariableChange = (index, field, value) => {
    const newVariables = variables.map((variable, i) => {
      if (i === index) {
        return { ...variable, [field]: value }
      }
      return variable
    })
    setVariables(newVariables)
    updateParameters({ variables: newVariables })
  }

  const addVariable = () => {
    setVariables([...variables, { name: "", value: "" }])
  }

  const removeVariable = (index) => {
    const newVariables = variables.filter((_, i) => i !== index)
    setVariables(newVariables)
    updateParameters({ variables: newVariables })
  }

  return (
    <div>
      <div className="mb-4">
        <h2
          htmlFor="order"
          className="block text-s font-medium text-gray-700 mb-4">
          Ordre de l'équation
        </h2>
        <select
          id="order"
          value={order}
          onChange={handleOrderChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option value="first">Premier Ordre</option>
          <option value="second">Second Ordre</option>
        </select>
      </div>

      <div className="mb-4">
        <h2 className="block text-s font-medium text-gray-700 mb-4">
          Condition initiale
        </h2>
        <label className="block text-sm font-medium text-gray-700">
          Nom de la fonction
        </label>
        <select
          value={functionName}
          onChange={(e) => {
            setFunctionName(e.target.value)
            updateParameters({ functionName: e.target.value })
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option value="x">x</option>
          <option value="y">y</option>
          <option value="z">z</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {functionName}(0) =
        </label>
        <input
          type="text"
          value={initialCondition}
          onChange={(e) => {
            setInitialCondition(e.target.value)
            updateParameters({ initialCondition: e.target.value })
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Valeur initiale"
        />
      </div>

      {order === "second" && (
        <div className="mb-4">
          <label
            htmlFor="secondInitialCondition"
            className="block text-sm font-medium text-gray-700">
            {functionName}'(0) =
          </label>
          <input
            type="text"
            value={secondInitialCondition}
            onChange={(e) => {
              setSecondInitialCondition(e.target.value)
              updateParameters({ setSecondInitialCondition: e.target.value })
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Valeur initiale"
          />
        </div>
      )}
      <div className="flex gap-4 mb-4 items-center justify-items-start">
        <h2 className="text-s font-medium text-gray-700">
          Variable supplémentaire
        </h2>
        <button
          onClick={addVariable}
          className="p-2 bg-blue-500 text-white rounded-md">
          Ajouter une variable
        </button>
      </div>
      {variables.map((variable, index) => (
        <div
          key={index}
          className="flex items-center mb-4">
          <input
            type="text"
            value={variable.name}
            onChange={(e) =>
              handleVariableChange(index, "name", e.target.value)
            }
            className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Nom de la variable"
          />
          <span className="mx-2">=</span>
          <input
            type="text"
            value={variable.value}
            onChange={(e) =>
              handleVariableChange(index, "value", e.target.value)
            }
            className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Valeur"
          />
          <button
            onClick={() => removeVariable(index)}
            className="ml-2 text-red-500">
            Supprimer
          </button>
        </div>
      ))}
    </div>
  )
}
