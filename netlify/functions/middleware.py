from flask import Flask, request, jsonify
from openai import OpenAI
import os
import json
import time
import re

app = Flask(__name__)

@app.route('/')
def home():
    return "Flask server is running!"

# Helper function
def fetch_tokens():
    data = {
        'assistant_id': os.environ.get('ASSISTANT_ID'),
        'openai_api_key': os.environ.get('OPENAI_API_KEY')
    }
    return data

data = fetch_tokens()
assistant_id = data['assistant_id']
openai_api_key = data['openai_api_key']

# Parse Response
def parse_recipe(text):
    response = ""
    for m in text:
        if m.role == 'assistant':
            response += f"{m.content[0].text.value}"
    return response

def recipe_to_json(output):
    title_search = re.search(r'^Recipe:\s+(.+?)$', output, re.MULTILINE)
    title = title_search.group(1) if title_search else "Unknown Recipe"

    ingredients_search = re.search(r'Ingredients:\s+(.+?)(?=\*\*Instructions:\*\*)', output, re.DOTALL)
    ingredients = [line.strip('- ').strip() for line in ingredients_search.group(1).strip().split('\n') if line.strip()] if ingredients_search else []

    instructions_search = re.search(r'Instructions:\s+(.+?)(?=\*\*Tips:\*\*|$)', output, re.DOTALL)
    instructions = instructions_search.group(1).strip().replace('\n', ' ').replace('  ', ' ') if instructions_search else "No instructions provided"

    tips_search = re.search(r'Tips:\s+(.+)$', output, re.DOTALL)
    tips = [line.strip('- ').strip() for line in tips_search.group(1).strip().split('\n') if line.strip()] if tips_search else []

    recipe_data = {
        "title": title,
        "ingredients": ingredients,
        "instructions": instructions,
        "tips": tips
    }

    return recipe_data

def wait_on_run(run, thread, client):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
        time.sleep(0.5)
    return run

client = OpenAI(
    api_key=openai_api_key,
    default_headers={"OpenAI-Beta": "assistants=v2"}
)



def submit_message(assistant_id, thread, user_message):
    client.beta.threads.messages.create(thread_id=thread.id, role="user", content=user_message)
    return client.beta.threads.runs.create_and_poll(thread_id=thread.id, assistant_id=assistant_id)

def get_response(thread):
    return client.beta.threads.messages.list(thread_id=thread.id, order="asc")

def create_thread_and_run(user_input):
    thread = client.beta.threads.create()
    run = submit_message(assistant_id, thread, user_input)
    return thread, run

@app.route('/generate_recipe', methods=['POST'])
def generate_recipe():
    data = request.json
    user_ingredients = data.get("ingredients", [])
    user_budget = data.get("budget", "Cheap")
    user_complexity = data.get("complexity", "Easy")
    user_cooking_time = data.get("cooking_time", "under 30 minutes")
    user_restrictions = data.get("restrictions", "none")

    prompt = (
        f"Create a recipe with the following parameters:\n"
        f"Ingredients: {', '.join(user_ingredients)}\n"
        f"Budget: {user_budget}\n"
        f"Complexity: {user_complexity}\n"
        f"Cooking Time: {user_cooking_time}\n"
        f"Dietary Restrictions: {user_restrictions}\n"
    )

    print("Generating Recipe...")

    thread, run = create_thread_and_run(prompt)
    run = wait_on_run(run, thread, client)

    response = get_response(thread)
    json_response = recipe_to_json(parse_recipe(response))

    return jsonify(json_response)

if __name__ == '__main__':
    app.run(debug=True)
