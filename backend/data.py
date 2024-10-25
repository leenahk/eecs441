from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import pandas as pd

app = Flask(__name__)
CORS(app)

user_data_file = 'users.json'
company_questions_file = 'company_questions.csv'

if not os.path.exists(user_data_file):
    with open(user_data_file, 'w') as file:
        json.dump({}, file)

def username_exists(username):
    with open(user_data_file, 'r') as file:
        users = json.load(file)
    return username in users

def get_user_companies(username):
    with open(user_data_file, 'r') as file:
        users = json.load(file)
    return users.get(username, {}).get('companies', [])

def register_user(username, company_list):
    if username_exists(username):
        return False
    else:
        with open(user_data_file, 'r+') as file:
            users = json.load(file)
            users[username] = {"companies": company_list, "progress": {company: [] for company in company_list}}
            file.seek(0)
            json.dump(users, file, indent=4)
        return True


def login_user(username):
    return username_exists(username)

# user login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username').strip().lower()

    if login_user(username):
        return jsonify({"message": f"Welcome back, {username}!"}), 200
    else:
        return jsonify({"message": "Username not found. Please register first."}), 404

# user registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username').strip().lower()
    company_list = [company.strip().lower() for company in data.get('companies', [])]

    if register_user(username, company_list):
        return jsonify({"message": f"User '{username}' registered successfully."}), 201
    else:
        return jsonify({"message": "Username already exists. Please choose another username."}), 409

# get common questions
@app.route('/common-questions', methods=['POST'])
def get_common_questions():
    data = request.json
    username = data.get('username').strip().lower()

    if not login_user(username):
        return jsonify({"message": "User not found. Please log in first."}), 404

    # get user companies and their progress
    company_list = get_user_companies(username)
    with open(user_data_file, 'r') as file:
        users = json.load(file)
        user_progress = users[username]['progress']

    company_questions = pd.read_csv(company_questions_file)

    completed_companies = []
    company_question_status = {}

    for company in company_list:
        # get all questions for the company
        company_df = company_questions[company_questions['Company'].str.lower() == company]
        all_questions = company_df['Title'].tolist()

        # get user's answered questions for this company
        answered_questions = user_progress.get(company, [])

        # check if all questions are answered
        if set(answered_questions) == set(all_questions):
            completed_companies.append(company)
        else:
            company_question_status[company] = {
                "total_questions": len(all_questions),
                "answered_questions": len(answered_questions),
                "remaining_questions": len(all_questions) - len(answered_questions),
                "questions": [q for q in all_questions if q not in answered_questions]
            }

    return jsonify({
        "completed_companies": completed_companies,
        "in_progress_companies": company_question_status
    }), 200


# update companies
@app.route('/update-companies', methods=['POST'])
def update_companies():
    data = request.json
    username = data.get('username').strip().lower()
    new_companies = [company.strip().lower() for company in data.get('companies', [])]

    if not login_user(username):
        return jsonify({"message": "User not found. Please log in first."}), 404

    with open(user_data_file, 'r+') as file:
        users = json.load(file)
        updated_companies = list(set(new_companies))  # avoid duplicates
        users[username]['companies'] = updated_companies

        file.seek(0)
        json.dump(users, file, indent=4)
        file.truncate()

    return jsonify({"message": f"Companies updated successfully for user '{username}'."}), 200


# get companies
@app.route('/get-companies', methods=['POST'])
def get_companies():
    data = request.json
    username = data.get('username').strip().lower()
    return jsonify({"companies": get_user_companies(username)}), 200

if __name__ == "__main__":
    app.run(debug=True)


@app.route('/answer-question', methods=['POST'])
def answer_question():
    data = request.json
    username = data.get('username').strip().lower()
    company = data.get('company').strip().lower()
    question_title = data.get('question_title').strip()

    if not login_user(username):
        return jsonify({"message": "User not found. Please log in first."}), 404

    with open(user_data_file, 'r+') as file:
        users = json.load(file)

        # check if user has the company in their list
        if company not in users[username]['companies']:
            return jsonify({"message": "Company not found in user's list."}), 404

        # mark question as answered
        if question_title not in users[username]['progress'][company]:
            users[username]['progress'][company].append(question_title)

        file.seek(0)
        json.dump(users, file, indent=4)
        file.truncate()

    return jsonify({"message": f"Question '{question_title}' for company '{company}' marked as answered."}), 200


# need a way to cross the companies off for a user once they've checked off all the questions for a company

'''
Track user progress: Add a progress section to the users.json file that tracks answered questions per company.
Answering a question: Add a new route to mark a question as answered for a specific company.
Check completion: Add logic to check whether all questions for a company are answered and cross off the company once complete.

'''