import path from "path"
import { PythonShell } from "python-shell"

export async function POST(request, response) {
  const requestData = await request.json()
  console.log("args : ", JSON.stringify(requestData))

  return new Promise((resolve, reject) => {
    let scriptPath = path.join(process.cwd(), "src/python")

    console.log(scriptPath)

    let options = {
      mode: "text",
      pythonOptions: ["-u"],
      scriptPath: scriptPath,
      args: [JSON.stringify(requestData)],
    }

    PythonShell.run("solver.py", options, (err, results) => {
      if (err) {
        console.error(err)
        response.status(500).send("Internal Server Error")
        reject(err)
      } else {
        response.json({ results: results })
        resolve()
      }
    })
  })
}
