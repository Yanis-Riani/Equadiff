import path from "path"
import { PythonShell } from "python-shell"

export async function POST(request) {
  const requestData = await request.json()
  let scriptPath = path.join(process.cwd(), "src/python")

  let options = {
    mode: "text",
    pythonOptions: ["-u"], // Pour forcer le mode "unbuffered" du stdout
    scriptPath: scriptPath,
    args: [JSON.stringify(requestData)],
  }

  try {
    const results = await new Promise((resolve, reject) => {
      let result = ""
      let pyshell = new PythonShell("solver.py", options)

      pyshell.on("message", function (message) {
        result += message
      })

      pyshell.on("stderr", function (stderr) {
        console.log(stderr)
      })

      pyshell.end(function (err, code, signal) {
        if (err) reject(err)
        resolve(result)
      })
    })
    return Response.json(JSON.parse(results))
  } catch (error) {
    console.error(error)
    return new Response("Error parsing Python script output", {
      status: 500,
    })
  }
}
