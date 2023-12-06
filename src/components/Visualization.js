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
    <div className="p-4 border border-gray-200 rounded-lg">
      {/* Affichage de l'équation avec KaTeX */}
      {equation && (
        <div className="mt-4">
          <h2 className="text-lg font-medium text-gray-700">
            Solution de l'équation
          </h2>
          <InlineMath math={equation} />
        </div>
      )}
      <h2 className="text-lg font-medium text-gray-700 mb-4">
        Solution Graphique
      </h2>

      {/* Visualisation Graphique avec Recharts */}
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  )
}
