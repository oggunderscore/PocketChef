# CPSC 481
# Artificial Intelligence
# Kevin Nguyen, Noah Khayat Albirkdar, Joshua Duncan
# 5/19/24

from openai import OpenAI
import os
import json
import time
import re

# Helper function
def fetch_tokens():
    with open('tokens.json', 'r') as file:
        data = json.load(file)
    return data

# Pretty Printer
def print_recipe(recipe):
    print(f"Recipe: {recipe['title']}\n")

    print("Ingredients:")
    for ingredient in recipe['ingredients']:
        print(f"- {ingredient}")

    print("\nInstructions:")
    # instructions = re.split(r'', recipe['instructions'].strip())
    for i, instruction in enumerate(recipe['instructions']):
    #     # if instruction.endswith('.'):
    #     #     instruction = instruction[:-1]
        print(f"{i+1}. {instruction}")

    if 'tips' in recipe and recipe['tips']:
        print("\nTips:")
        for tip in recipe['tips']:
            print(f"- {tip}")


# Parse Response
def parse_recipe(text):
    response = ""
    for m in text:
        if m.role == 'assistant':
            response += f"{m.content[0].text.value}"
    return response

def recipe_to_json(output):
        # Extracting the recipe title
    title_search = re.search(r'^Recipe:\s+(.+?)$', output, re.MULTILINE)
    title = title_search.group(1) if title_search else "Unknown Recipe"

    # Extracting ingredients
    ingredients_search = re.search(r'Ingredients:\s*(.*?)(?=\n\n|Instructions:)', output, re.DOTALL)
    ingredients = [line.strip('- ').strip() for line in ingredients_search.group(1).strip().split('\n') if line.strip()] if ingredients_search else []

    # Extracting instructions
    instructions_search = re.search(r'Instructions:\s*(.*?)\n\nTips:', output, re.DOTALL)
    if not instructions_search:
        instructions_search = re.search(r'Instructions:\s*(.*)', output, re.DOTALL)
    instructions = instructions_search.group(1).strip().replace('. ', '\n').replace('\n\n', '\n').split('\n') if instructions_search else "No instructions provided"


    # Extracting tips
    tips_search = re.search(r'Tips:\s*(.*?)(?=\n\n|$)', output, re.DOTALL)
    tips = [line.strip('- ').strip() for line in tips_search.group(1).strip().split('\n') if line.strip()] if tips_search else []

    # Creating the JSON object
    recipe_data = {
        "title": title,
        "ingredients": ingredients,
        "instructions": instructions,
        "tips": tips
    }

    return recipe_data

# Waiting for Generation to complete
def wait_on_run(run, thread):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
        time.sleep(0.5)
    return run

client = OpenAI(
    api_key=os.environ.get(
        "OPENAI_API_KEY", "<your OpenAI API key if not set as env var>"
    ), default_headers={"OpenAI-Beta": "assistants=v2"}
)

# Fetch tokens
data = fetch_tokens()
assistant_id = data['assistant_id']

def submit_message(assistant_id, thread, user_message):
    client.beta.threads.messages.create(thread_id=thread.id, role="user", content=user_message)
    return client.beta.threads.runs.create_and_poll(thread_id=thread.id, assistant_id=assistant_id)

def get_response(thread):
    return client.beta.threads.messages.list(thread_id=thread.id, order="asc")

def create_thread_and_run(user_input):
    thread = client.beta.threads.create()
    run = submit_message(assistant_id, thread, user_input)
    return thread, run

def returnbudget(num):
    if num == 1:
        return "Cheap"
    elif num == 2:
        return "Somewhat Cheap"
    elif num == 3:
        return "Moderate"
    elif num == 4:
        return "Slightly Expensive"
    else:
        return "Expensive"

def returncomplex(num):
    if num == 1:
        return "Easy"
    elif num == 2:
        return "Intermediate"
    else:
        return "Difficult"

def returntime(num):
    if num < 30:
        return "under 30 minutes"
    elif num >= 30 and num <= 60:
        return "30-60 minutes"
    elif num >= 61 and num <= 120:
        return "1-2 hours"
    else:
        return "over 2 hours"

while True:

    print(f"\n============= Pocket Chef =============\n\n")

    # User input for ingredients as a comma-separated list
    user_ingredients_input = input("Please input ingredients separated by commas (e.g., Chicken, rice, eggs): ")
    user_ingredients = [ingredient.strip() for ingredient in user_ingredients_input.split(',')]

    # User input for budget
    budgetfail = False
    budget = input("Budget Value (1-5): ")
    if not budget.isdigit():
        budgetfail = True
    try:
        if int(budget) > 5 or int(budget) < 1:
            budgetfail = True
    except ValueError:
        budgetfail = True
    while budgetfail:
        budget = input("Please enter a number between 1 and 5: ")
        try:
            if budget.isdigit() and int(budget) > 0 and int(budget) < 6:
                budgetfail = False
        except ValueError:
            budgetfail = False
    user_budget = returnbudget(int(budget))

    # User input for complexity
    complexfail = False
    complexity = input("Complexity Level (1-3): ")
    if not complexity.isdigit():
        complexfail = True
    try:
        if int(complexity) > 3 or int(complexity) < 1:
            complexfail = True
    except ValueError:
        complexfail = True
    while complexfail:
        complexity = input("Please enter a number between 1 and 3: ")
        try:
            if complexity.isdigit() and int(complexity) > 0 and int(complexity) < 4:
                complexfail = False
        except ValueError:
            complexfail = False
    user_complexity = returncomplex(int(complexity))

    # User input for cooking time
    timefail = True
    while timefail:
        cooktime = input("Available cooking time (in minutes): ")
        try:
            cooktime = int(cooktime)
            timefail = False
        except ValueError:
            timefail = True
            cooktime = input("Please enter your desired cooking time for this meal: ")
            try:
                cooktime = int(cooktime)
                timefail = False
            except ValueError:
                timefail = True
    user_cooking_time = returntime(cooktime)

    # User input for dietary restrictions
    user_restrictions = input("Enter Dietary Restrictions: ")
    user_restrictions = [ingredient.strip() for ingredient in user_ingredients_input.split(',')]

    # Prompt engineering
    prompt = (
        f"Create a recipe with the following parameters:\n"
        f"Ingredients: {', '.join(user_ingredients)}\n"
        f"Budget: {user_budget}\n"
        f"Complexity: {user_complexity}\n"
        f"Cooking Time: {user_cooking_time}\n"
        f"Dietary Restrictions: {', '.join(user_restrictions)}\n"
        f"Format the output with a Recipe, Ingredients, Instructions (separated by newline, do not include step numbers), Tips section."
    )

    print(prompt)

    # Output in the following format: Receipt name, Instructions, Cooking Time:
    print(f"\nGenerating Recipe...\n")
    thread, run = create_thread_and_run(prompt)
    run = wait_on_run(run, thread)

    response = get_response(thread)

    # print(f"Raw Response: {response}")
    json_response = recipe_to_json(parse_recipe(response))

    print_recipe(json_response)

    # Ask the user if they want to generate another recipe
    another_recipe = input("\nWould you like to generate another recipe? (y/n): ").strip().lower()
    if another_recipe != 'y':
        break

print("\nThank you for using PocketChef!")
