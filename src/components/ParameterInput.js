"use client"
import Add from "@/img/add.svg"
import Delete from "@/img/delete.svg"
import Minus from "@/img/minus.svg"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function ParameterInput({ onParametersChange }) {
  const [functionName, setFunctionName] = useState("y")
  const [unknownName, setUnknownName] = useState("x")
  const [initialConditions, setInitialConditions] = useState([
    { condition: "", value: "" },
  ])
  const [variables, setVariables] = useState([{ name: "", value: "" }])
  const [range, setRange] = useState([-10, 10])
  const [ptNumber, setPtNumber] = useState(100)
  const [integrationConstant, setIntegrationConstant] = useState(1)

  const [parameters, setParameters] = useState({
    functionName: functionName,
    unknownName: unknownName,
    range: [-10, 10],
    initialConditions: [],
    ptnumber: 100,
    variables: variables,
    integrationConstant: 1,
  })

  useEffect(() => {
    updateParameters({
      range: range,
      ptnumber: ptNumber,
      integrationConstant: integrationConstant,
    })
  }, [range, ptNumber, integrationConstant])

  const updateParameters = (newParams) => {
    const updatedParameters = { ...parameters, ...newParams }
    setParameters(updatedParameters)
    onParametersChange(updatedParameters)
  }

  const updateInitialConditionsInParameters = (initialConditions) => {
    const initialConditionsText = initialConditions.map((condition, index) => {
      return `${functionName}${"'".repeat(index)}(0) = ${condition.value}`
    })
    updateParameters({ initialConditions: initialConditionsText })
  }

  // Gérer le changement des conditions initiales
  const handleInitialConditionChange = (index, value) => {
    const newInitialConditions = initialConditions.map((item, i) => {
      if (i === index) {
        return { ...item, value: value }
      }
      return item
    })
    setInitialConditions(newInitialConditions)
    updateInitialConditionsInParameters(newInitialConditions)
  }

  const addInitialCondition = () => {
    setInitialConditions([...initialConditions, { condition: "", value: "" }])
  }

  const removeInitialCondition = () => {
    setInitialConditions(initialConditions.slice(0, -1))
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
        <h2 className="block text-s font-medium text-gray-700 mb-4">
          Parametres de la fonction
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
          className="mt-1 mb-2 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          <option value="x">f</option>
          <option value="y">y</option>
          <option value="z">u</option>
        </select>
        <label className="block text-sm font-medium text-gray-700">
          Nom de l'inconue
        </label>
        <select
          value={unknownName}
          onChange={(e) => {
            setUnknownName(e.target.value)
            updateParameters({ UnknownedName: e.target.value })
          }}
          className="mt-1 mb-2 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
          <option value="x">x</option>
          <option value="y">a</option>
          <option value="z">b</option>
        </select>
      </div>
      <div className="flex gap-4 mb-4 items-center justify-items-start">
        <h2 className="block text-s font-medium text-gray-700 ">
          Condition initiale
        </h2>
        <Image
          priority
          src={Add}
          height={28}
          width={28}
          alt="Ajouter une condition initiale"
          onClick={addInitialCondition}
        />
        <Image
          priority
          src={Minus}
          height={28}
          width={28}
          alt="Enlever une condition initiale"
          onClick={removeInitialCondition}
        />
      </div>
      {initialConditions.map((condition, index) => (
        <div
          className="mb-4 flex items-center justify-items-start gap-2"
          key={index}>
          <label className="block text-sm font-medium text-gray-700">
            {condition.condition || `${functionName}${"'".repeat(index)}(0)`} =
          </label>
          <input
            type="text"
            value={condition.value}
            onChange={(e) =>
              handleInitialConditionChange(index, e.target.value)
            }
            className="mt-1 block w-2/4 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Valeur initiale"
          />
        </div>
      ))}
      <div className="flex gap-4 mb-4 items-center justify-items-start">
        <h2 className="text-s font-medium text-gray-700">
          Variable supplémentaire
        </h2>
        <Image
          priority
          src={Add}
          height={28}
          width={28}
          alt="Ajouter une variable"
          onClick={addVariable}
        />
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
            className="block w-1/3 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Nom de la variable"
          />
          <span className="mx-2">=</span>
          <input
            type="text"
            value={variable.value}
            onChange={(e) =>
              handleVariableChange(index, "value", e.target.value)
            }
            className="block w-1/3 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Valeur"
          />
          <Image
            priority
            src={Delete}
            height={32}
            width={32}
            alt="Supprimer la variable ${variable.name}"
            onClick={() => removeVariable(index)}
          />
        </div>
      ))}
      {/* Input pour 'range' */}
      <div className="mb-4">
        <h2 className="text-s font-medium text-gray-700 mb-4">
          Paramètre du graphique
        </h2>
        <label className="block text-sm font-medium text-gray-700">
          Plage de valeurs
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={range[0]}
            onChange={(e) => setRange([Number(e.target.value), range[1]])}
            className="mt-1 block w-1/4 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <input
            type="number"
            value={range[1]}
            onChange={(e) => setRange([range[0], Number(e.target.value)])}
            className="mt-1 block w-1/4 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Input pour 'ptnumber' */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Nombre de points
        </label>
        <input
          type="number"
          value={ptNumber}
          onChange={(e) => setPtNumber(Number(e.target.value))}
          className="mt-1 block w-1/2 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* Input pour 'integrationConstant' */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Constante d'intégration
        </label>
        <input
          type="number"
          value={integrationConstant}
          onChange={(e) => setIntegrationConstant(Number(e.target.value))}
          className="mt-1 block w-1/2 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  )
}
