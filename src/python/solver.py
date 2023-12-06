import json

import sympy as sp
from scipy.integrate import solve_ivp


def parse_equation(equation_str, params):
    # Remplacement des variables et constantes
    for var in params["variables"]:
        equation_str = equation_str.replace(var["name"], var["value"])
        
    # Remplacement de y en y(t)
    equation_str = equation_str.replace(params["functionName"], f"{params['functionName']}({params['unknownedName']})")

    # Conversion des termes y', y'', etc.
    y = sp.Function(params["functionName"])
    t = sp.Symbol(params["unknownedName"])
    max_deriv = equation_str.count("'")
    for n in range(max_deriv, 0, -1):
        
        equation_str = equation_str.replace(f"{params['functionName']}({params['unknownedName']})'" * n, f"Derivative({params['functionName']}({params['unknownedName']}), ({params['unknownedName']}, {n}))")

    # Remplacement des puissances et autres opérations
    equation_str = equation_str.replace("^", "**")

    return equation_str

def solve_equation(equation_str, parameters):
    # Déclaration des symboles
    t = sp.symbols(parameters["functionName"]["unknownedName"])
    functionName = parameters["functionName"]
    y = sp.Function(functionName)(t)

    # Analyse de l'équation
    equation = parse_equation(equation_str, functionName)
    eq = sp.sympify(equation)

    # Résoudre l'équation
    solution = sp.dsolve(eq, y)

    return solution

def evaluate_solution(solution, parameters):
    # Conversion de la solution symbolique en fonction numérique
    t = sp.symbols(parameters["functionName"]["unknownedName"])
    y = sp.lambdify(t, solution.rhs, 'numpy')

    # Paramètres pour l'évaluation numérique
    t_span = parameters["t_span"]
    t_eval = parameters["t_eval"]

    # Résoudre numériquement
    sol = solve_ivp(y, t_span, [float(parameters["initialCondition"])], t_eval=t_eval)

    # Préparer les données pour le graphique
    graph_data = [{"x": time, "y": value} for time, value in zip(sol.t, sol.y[0])]
    return graph_data

def main():
    data = {
        "Equation": "y''-a*x*y+y^e=5-x^2",
        "Parameter": {
            "functionName": "y",
            "unknownedName": "x",
            "t_span": [0, 10],
            "t_eval": [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 10],
            "initialCondition": "0",
            "variables": [{"name": "a", "value": "2"}, {"name": "e", "value": "2"}]
        }
    }

    equation_str = parse_equation(data["Equation"], data["Parameter"])
    print(equation_str)


if __name__ == "__main__":
    main()
