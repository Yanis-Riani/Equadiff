import json
import re
import sys

import numpy as np
import sympy as sp


def parse_differential_equation(equation:str, parameters:dict, x, y, order:int) -> sp.Eq:

    # Remplacement des variables et constantes
    for var in parameters["variables"]:
        equation = equation.replace(var["name"], var["value"])

    # Replace the variables with values compressible by sympy
    for i in range(order, 0, -1):
        if "'" * i in equation:
            temp_diff = "$" + str(i)
            equation = equation.replace(parameters["functionName"] + ("'" * i), str(temp_diff))

    equation = equation.replace(parameters["functionName"], str(y))

    for i in range(order, 0, -1):
        temp_diff = "$" + str(i)
        equation = equation.replace(str(temp_diff), str(y.diff(x, i)))

    # Split the string into left-hand and right-hand sides
    equation_parts = equation.split('=')
    equation_lhs = equation_parts[0].strip()
    equation_rhs = equation_parts[1].strip()

    # Build the SymPy equation using diff for the derivative
    return sp.Eq(sp.sympify(equation_lhs), sp.sympify(equation_rhs))
    

def solve_differential_equation(equation:str, parameters:dict):
    
    # Use regex to find all occurrences of the derivative (e.g., y', y'', y''', etc.)
    occurrences_derivatives = re.findall(rf'{parameters["functionName"]}\'*', equation)
    
    # The order of the equation is equal to the maximum length of occurrences - 1
    order = len(max(occurrences_derivatives, key=len)) - 1

    x = sp.symbols(parameters["unknownName"])
    y = sp.Function(parameters["functionName"])(x)
    
    equation = parse_differential_equation(equation, parameters, x, y, order)
    
    initial_conditions = parse_initial_conditions(parameters["initialConditions"], y, x, order)

    if initial_conditions:
        return sp.dsolve(equation, y, ics=initial_conditions)
    else:
        return sp.dsolve(equation, y)


def parse_initial_conditions(initial_conditions:list, y, x, order:int) -> dict:
    initial_conditions_dict = {}
    for condition in initial_conditions:
        condition_parts = condition.strip().split('=')
        if len(condition_parts) == 2:
            num_apostrophes = condition_parts[0].count("'")
            if num_apostrophes < order:
                initial_conditions_dict[y.subs(x, num_apostrophes)] = sp.sympify(condition_parts[1].strip())

    return initial_conditions_dict

def generate_graph_data(solution, parameters, integration_constant):
    x = sp.symbols(parameters["unknownName"])
    y_func = solution.rhs.subs({'C1': integration_constant})  # Utiliser la constante d'intégration
    x_values = np.linspace(parameters["range"][0], parameters["range"][1], 100)  # Générer 100 points
    y_values = [y_func.subs(x, val) for val in x_values]  # Évaluer la solution pour chaque point x

    # Préparer les données pour Recharts
    graph_data = [{"x": float(x_val), "y": float(y_val)} for x_val, y_val in zip(x_values, y_values)]
    return graph_data


data = {
    "Equation": "y'-a*x*y+y^e=5-x^2",
    "Parameter": {
        "functionName": "y",
        "unknownName": "x",
        "range": [0, 10],
        "initialConditions": [],
        "integrationConstant": 2,
        "variables": [{"name": "a", "value": "2"}, {"name": "e", "value": "2"}]
    }
}

# Récupérer les données JSON passées en argument
# data = json.loads(sys.argv[1])

# Extraction de l'équation et des paramètres
equation_str = data["Equation"]
parameters = data["Parameter"]

# Résolution de l'équation différentielle
solution = solve_differential_equation(equation_str, parameters)

# Affichage des résultats
# print(sp.latex(solution))
# print(solution.rhs)
graphdata = generate_graph_data(solution, data["Parameter"], data["Parameter"]["integrationConstant"])

output = {
    "solution": str(solution.rhs),
    "latex": str(sp.latex(solution)),
    "graphdata": graphdata  # Gardez graphdata sous forme de liste d'objets
}

# Imprimez le JSON sérialisé
print(json.dumps(output))
