import json
import re
import sys

import numpy as np
import sympy as sp


def format_differential_equation(equation: str, parameters: dict, x, y, order: int) -> sp.Eq:
    for var in parameters["variables"]:
        equation = equation.replace(var["name"], var["value"])

    equation = equation.replace(parameters["functionName"], str(y))

    for i in range(order, 0, -1):
        derivative = y.diff(x, i)
        equation = equation.replace(f"{parameters['functionName']}({parameters['unknownName']})"+"'" * i, str(derivative))

    lhs, rhs = map(str.strip, equation.split('='))
    return sp.Eq(sp.sympify(lhs), sp.sympify(rhs))

def find_highest_order_derivative(equation, function_name):
    max_order = 0
    current_order = 0
    in_derivative = False

    for char in equation:
        if char == function_name and not in_derivative:
            in_derivative = True
            current_order = 0
        elif char == "'" and in_derivative:
            current_order += 1
            max_order = max(max_order, current_order)
        else:
            in_derivative = False

    return max_order  

def compute_differential_equation(equation:str, parameters:dict):
    
    order = find_highest_order_derivative(equation, parameters["functionName"])
    print(order)

    x = sp.symbols(parameters["unknownName"])
    y = sp.Function(parameters["functionName"])(x)
    
    equation = format_differential_equation(equation, parameters, x, y, order)
    print(equation)
    
    initial_conditions = format_initial_conditions(parameters["initialConditions"], y, x, order)

    if initial_conditions:
        return sp.dsolve(equation, y, ics=initial_conditions)
    else:
        return sp.dsolve(equation, y)


def format_initial_conditions(initial_conditions: list, y, x, order: int) -> dict:
    initial_conditions_dict = {}
    for condition in initial_conditions:
        lhs, rhs = [part.strip() for part in condition.split('=')]
        num_apostrophes = lhs.count("'")
        
        if num_apostrophes < order:
            derivative = y.diff(x, num_apostrophes)
            initial_conditions_dict[derivative] = sp.sympify(rhs)

    return initial_conditions_dict

def generate_graph_data(solution, parameters, integration_constant):
    try:
        x = sp.symbols(parameters["unknownName"])
        y_func = solution.rhs.subs({'C1': integration_constant})
        x_values = np.linspace(parameters["range"][0], parameters["range"][1], parameters["ptnumber"])
        y_values = [y_func.subs(x, val) for val in x_values]

        graph_data = [{"x": float(x_val), "y": float(y_val)} for x_val, y_val in zip(x_values, y_values)]
        return graph_data
    except:
        return []


data = {
    "Equation": "y'-a*x*y+y^e=5-x^2",
    "Parameter": {
        "functionName": "y",
        "unknownName": "x",
        "range": [0, 10],
        "ptnumber": 100,
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
solution = compute_differential_equation(equation_str, parameters)

try:
    graphdata = generate_graph_data(solution, data["Parameter"], data["Parameter"]["integrationConstant"])

    # Vous pouvez également convertir la solution en une réponse JSON si nécessaire
    print(json.dumps({"solution": str(solution), "latex": str(sp.latex(solution)), "graphdata": graphdata}))
except:
    print(json.dumps({"solution": str(solution), "latex": str(sp.latex(solution)), "graphdata": []}))
