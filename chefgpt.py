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

# Helper function
def show_json(obj):
    print(json.dumps(obj, indent=4))

# Pretty printing helper
def pretty_print(messages):
    print("# Messages")
    for m in messages:
        print(f"{m.role}: {m.content[0].text.value}")
    print()

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
    ingredients_search = re.search(r'Ingredients:\s+(.+?)(?=\*\*Instructions:\*\*)', output, re.DOTALL)
    ingredients = [line.strip('- ').strip() for line in ingredients_search.group(1).strip().split('\n') if line.strip()] if ingredients_search else []

    # Extracting instructions
    instructions_search = re.search(r'Instructions:\s+(.+?)(?=\*\*Tips:\*\*|$)', output, re.DOTALL)
    instructions = instructions_search.group(1).strip().replace('\n', ' ').replace('  ', ' ') if instructions_search else "No instructions provided"

    # Extracting tips
    tips_search = re.search(r'Tips:\s+(.+)$', output, re.DOTALL)
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
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.5)
    return run

client = OpenAI(
    api_key=os.environ.get(
        "OPENAI_API_KEY", "<your OpenAI API key if not set as env var>"
    )
)

# TODO: This needs to be passed correctly and not be global?

data = fetch_tokens()
assistant_id = data['assistant_id']

# show_json(client)
# print(f'EnvironmentVar: {os.environ.get("OPENAI_API_KEY", "<your OpenAI API key if not set as env var>")}')

def submit_message(assistant_id, thread, user_message):
    client.beta.threads.messages.create(
        thread_id=thread.id, role="user", content=user_message
    )
    return client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant_id,
    )

def get_response(thread):
    return client.beta.threads.messages.list(thread_id=thread.id, order="asc")

def create_thread_and_run(user_input):

    thread = client.beta.threads.create()
    run = submit_message(assistant_id, thread, user_input)

    return thread, run


# while True:

# Budget Values
# 1-5
# 1 = Cheap
# 2 = Somewhat Cheap
# 3 = Moderate
# 4 = Slightly Expensive
# 5 = Expensive


user_ingredients = ["ribeye steak", "potatoes", "corn", "salt", "pepper", "butter"]
user_budget = "Cheap"
user_complexity = "Easy"
user_cooking_time = "under 30 minutes"
user_restrictions = "none"


# Prompt Engineering - Modify this to produce the most consistent and reliable outputs
prompt = (
    f"Create a recipe with the following parameters:\n"
    f"Ingredients: {', '.join(user_ingredients)}\n"
    f"Budget: {user_budget}\n"
    f"Complexity: {user_complexity}\n"
    f"Cooking Time: {user_cooking_time}\n"
    f"Dietary Restrictions: {user_restrictions}\n"
    f"Please provide a recipe that is easy to follow and includes cooking instructions.\n"
    f"Do not include a section with equipment.\n"
    f"Include a Tips section but no final summary section at the end.\n"
    f"Do not prepend #'s or *'s before sections such as Recipe or Ingredients.\n"
)

# Output in the following format: Receipt name, Instructions, Cooking Time:

print(f"Generating Recipe...")
thread, run = create_thread_and_run(prompt)
run = wait_on_run(run, thread)
print(f"Done.")
response = get_response(thread)
# pretty_print(response)

# print(parse_recipe(response))

json_response = recipe_to_json(parse_recipe(response))

print(json_response)

# User input example
# userInput = input("")
# thread, run = create_thread_and_run(userInput)
# print(f'Creating Recipe...')
# run = wait_on_run(run, thread)
# print(f'Done.')
# pretty_print(get_response(thread))

# # Emulating concurrent user requests
# thread1, run1 = create_thread_and_run(
#     "I need to solve the equation `3x + 11 = 14`. Can you help me?"
# )
# thread2, run2 = create_thread_and_run("Could you explain linear algebra to me?")
# thread3, run3 = create_thread_and_run("I don't like math. What can I do?")

# Now all Runs are executing...
