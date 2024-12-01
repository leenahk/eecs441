from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import pandas as pd

app = Flask(__name__)
CORS(app)

user_data_file = 'users.json'
company_questions_file = 'company_questions.csv'
company_questions = pd.read_csv(company_questions_file)
company_questions['Normalized Frequency'] = company_questions.groupby('Company')['Frequency'].transform(lambda x: x / x.sum())


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
    return [c.lower().replace(' ', '-') for c in users.get(username, {}).get('companies', [])]

def get_user_companies_for_display(username):
    with open(user_data_file, 'r') as file:
        users = json.load(file)
    return users.get(username, {}).get('companies', [])

def get_completed_questions(username):
    with open(user_data_file, 'r') as file:
        users = json.load(file)
    return users.get(username, {}).get('completed-questions', [])

def register_user(username, company_list):
    if username_exists(username):
        return False
    else:
        with open(user_data_file, 'r+') as file:
            users = json.load(file)
            users[username] = {
                "companies": {company: {"total-questions": 0, "remaining-questions": 0} for company in company_list},
                "completed-questions": [],
                #"incomplete-questions": company_questions[company_questions['Company'].str.lower().isin(company_list)]['Title'].tolist()
            }
            file.seek(0)
            json.dump(users, file, indent=4)
        return True

def calculate_dataframe(company_list):
    # filter data based on user's companies
    filtered_df = company_questions[company_questions['Company'].str.lower().isin(company_list)]

    # Aggregate list of companies that ask each question
    company_list_df = (
        filtered_df.groupby('Title')['Company']
        .apply(list)  # Aggregate companies into a list
        .reset_index()
    )
    company_list_df.columns = ['Title', 'Companies']

    # Calculate the probability for each question
    probabilities_df = (
        filtered_df.groupby('Title')['Normalized Frequency']
        .sum() / len(company_list)
    ).reset_index()
    probabilities_df.columns = ['Title', 'Probability']

    # Merge the two dataframes to include all required information
    result_df = pd.merge(company_list_df, probabilities_df, on='Title')
    result_df = pd.merge(result_df, filtered_df[['Title', 'Leetcode Question Link', 'Difficulty']].drop_duplicates(), on='Title')

    return result_df

def login_user(username):
    return username_exists(username)

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

    result_df = calculate_dataframe(get_user_companies(username))
    answered_df = result_df[result_df['Title'].isin(get_completed_questions(username))]
    unanswered_df = result_df[~result_df['Title'].isin(get_completed_questions(username))]

    # Calculate preparadeness
    preparedness_score = answered_df['Probability'].sum()
    unanswered_df = unanswered_df.sort_values(by='Probability', ascending=False).head(12)
    potential_preparedness_score = unanswered_df['Probability'].sum() + preparedness_score

    questions_dict = json.loads(unanswered_df.to_json(orient='records'))

    response = {
        "questions": questions_dict,
        "preparedness": preparedness_score,
        "potential": potential_preparedness_score
    }

    return jsonify(response), 200

@app.route('/complete-question', methods=['POST'])
def complete_question():
    data = request.json
    username = data.get('username').strip().lower()
    question = data.get('question').strip()

    with open(user_data_file, 'r+') as file:
        users = json.load(file)
        
        users[username]["completed-questions"].append(question)
        
        for company in company_questions[company_questions['Title'] == question]['Company']:
            for user_company in users[username]["companies"]:
                if company == user_company.lower().replace(' ', '-'):
                    users[username]["companies"][user_company]["remaining-questions"] -= 1
        
        file.seek(0)
        json.dump(users, file, indent=4)
        file.truncate()

    return jsonify({"message": f"Question marked as completed for user '{username}'.", "companies": users[username]['companies']}), 200


@app.route('/remove-question', methods=['POST'])
def remove_question():
    data = request.json
    username = data.get('username').strip().lower()
    question = data.get('question').strip()

    with open(user_data_file, 'r+') as file:
        users = json.load(file)
        
        users[username]["completed-questions"].remove(question)
            
        for company in company_questions[company_questions['Title'] == question]['Company']:
            for user_company in users[username]["companies"]:
                if company == user_company.lower().replace(' ', '-'):
                    users[username]["companies"][user_company]["remaining-questions"] += 1

        file.seek(0)
        json.dump(users, file, indent=4)
        file.truncate()

    return jsonify({"message": f"Question marked as incomplete for user '{username}'.", "companies": users[username]['companies']}), 200


@app.route('/completed-questions', methods=['POST'])
def completed_questions():
    data = request.json
    username = data.get('username').strip().lower()

    if not login_user(username):
        return jsonify({"message": "User not found. Please log in first."}), 404

    completed_questions = get_completed_questions(username)
    completed_questions_df = company_questions[company_questions['Title'].isin(completed_questions)]
    completed_questions_df = completed_questions_df[['Title', 'Leetcode Question Link', 'Difficulty']].drop_duplicates()
    completed_questions_json = completed_questions_df.to_json(orient='records')
    completed_questions_dict = json.loads(completed_questions_json)
    return jsonify({"message": f"Completed questions for '{username}'.", "questions": completed_questions_dict}), 200


@app.route('/update-companies', methods=['POST'])
def update_companies():
    data = request.json
    username = data.get('username').strip().lower()
    new_companies = {company: {"total-questions": 0, "remaining-questions": 0} for company in data.get('companies', [])}
    completed_questions = get_completed_questions(username)

    for company in new_companies.keys():
        filtered_df = company_questions[company_questions['Company'] == company.lower().replace(' ', '-')]
        total_questions = filtered_df.shape[0]
        filtered_questions = filtered_df['Title'].tolist()
        completed_for_company = [q for q in completed_questions if q in filtered_questions]
        new_companies[company]["total-questions"] = total_questions
        new_companies[company]["remaining-questions"] = total_questions - len(completed_for_company) 
    
    with open(user_data_file, 'r+') as file:
        users = json.load(file)
        users[username]['companies'] = new_companies
        file.seek(0)
        json.dump(users, file, indent=4)
        file.truncate()

    return jsonify({"message": f"Companies updated successfully for user '{username}'.", "companies": users[username]['companies']}), 200


@app.route('/get-companies', methods=['POST'])
def get_companies():
    data = request.json
    username = data.get('username').strip().lower()
    return jsonify({"companies": get_user_companies_for_display(username)}), 200

@app.route('/get-questions', methods=['POST'])
def get_questions():
    data = request.json
    username = data.get('username').strip().lower()
    return jsonify({"questions": get_completed_questions(username)}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
