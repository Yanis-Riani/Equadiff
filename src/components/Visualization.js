"use client"

import { InlineMath } from "react-katex"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function Visualization({ data, equation }) {
  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-lg">
      {/* Affichage de l'équation avec KaTeX */}
      {equation && (
        <div className="mb-4 flex flex-col items-center">
          <h2 className="mb-2 text-lg font-medium text-gray-700">
            Solution de l'équation
          </h2>
          <InlineMath math={equation} />
        </div>
      )}
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Solution Graphique
        </h2>

        {/* Visualisation Graphique avec Recharts */}

        <LineChart
          width={600}
          height={600}
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#8884d8"
            activeDot={{ r: 100 }}
          />
        </LineChart>
      </div>
    </div>
  )
}
