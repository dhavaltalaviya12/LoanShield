import pandas as pd
import numpy as np
from flask import Flask, render_template, request
import joblib
import os

# Initialize Flask App
app = Flask(__name__)


# Get the directory where app.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "best_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")

# Load Model and Scaler
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# --- CONFIGURATION ---
# We must ensure the columns passed to the model match EXACTLY what it was trained on.
# These must match X_train.columns from your Notebook.
EXPECTED_COLUMNS = [
    "Age",
    "Income",
    "LoanAmount",
    "CreditScore",
    "MonthsEmployed",
    "NumCreditLines",
    "InterestRate",
    "LoanTerm",
    "DTIRatio",
    "Education",
    "HasMortgage",
    "HasDependents",
    "HasCoSigner",
    # One-Hot Encoded Columns (Check your X_train.columns to confirm exact names!)
    "EmploymentType_Part-time",
    "EmploymentType_Self-employed",
    "EmploymentType_Unemployed",
    "MaritalStatus_Married",
    "MaritalStatus_Single",
    "LoanPurpose_Business",
    "LoanPurpose_Education",
    "LoanPurpose_Home",
    "LoanPurpose_Other",
]


def preprocess_input(form_data):
    """
    Takes a dictionary of form data and converts it into a DataFrame
    ready for the model.
    """
    # 1. Initialize a DataFrame with zeros for all expected columns
    df = pd.DataFrame(0, index=[0], columns=EXPECTED_COLUMNS)

    # 2. Fill Numerical Values
    df["Age"] = float(form_data["Age"])
    df["Income"] = float(form_data["Income"])
    df["LoanAmount"] = float(form_data["LoanAmount"])
    df["CreditScore"] = float(form_data["CreditScore"])
    df["MonthsEmployed"] = float(form_data["MonthsEmployed"])
    df["NumCreditLines"] = float(form_data["NumCreditLines"])
    df["InterestRate"] = float(form_data["InterestRate"])
    df["LoanTerm"] = float(form_data["LoanTerm"])
    df["DTIRatio"] = float(form_data["DTIRatio"])

    # 3. Fill Binary Mappings (Yes/No -> 1/0)
    df["HasMortgage"] = 1 if form_data["HasMortgage"] == "Yes" else 0
    df["HasDependents"] = 1 if form_data["HasDependents"] == "Yes" else 0
    df["HasCoSigner"] = 1 if form_data["HasCoSigner"] == "Yes" else 0

    # 4. Fill Ordinal Mapping (Education)
    education_map = {"High School": 0, "Bachelor's": 1, "Master's": 2, "PhD": 3}
    df["Education"] = education_map.get(form_data["Education"], 0)

    # 5. Handle One-Hot Encoding Logic
    # We manually set the specific column to 1 based on selection

    # EmploymentType
    emp_type = form_data["EmploymentType"]
    if emp_type == "Part-time":
        df["EmploymentType_Part-time"] = 1
    elif emp_type == "Self-employed":
        df["EmploymentType_Self-employed"] = 1
    elif emp_type == "Unemployed":
        df["EmploymentType_Unemployed"] = 1
    # Note: 'Full-time' is the reference category (all 0s), so we do nothing.

    # MaritalStatus
    marital = form_data["MaritalStatus"]
    if marital == "Married":
        df["MaritalStatus_Married"] = 1
    elif marital == "Single":
        df["MaritalStatus_Single"] = 1
    # Note: 'Divorced' is the reference category.

    # LoanPurpose
    purpose = form_data["LoanPurpose"]
    if purpose == "Business":
        df["LoanPurpose_Business"] = 1
    elif purpose == "Education":
        df["LoanPurpose_Education"] = 1
    elif purpose == "Home":
        df["LoanPurpose_Home"] = 1
    elif purpose == "Other":
        df["LoanPurpose_Other"] = 1
    # Note: 'Auto' is the reference category.

    # 6. Scale Numerical Columns
    cols_to_scale = [
        "Age",
        "Income",
        "LoanAmount",
        "CreditScore",
        "MonthsEmployed",
        "NumCreditLines",
        "InterestRate",
        "LoanTerm",
        "DTIRatio",
    ]
    df[cols_to_scale] = scaler.transform(df[cols_to_scale])

    return df


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/assess")
def assess():
    return render_template("index.html")


@app.route("/insights")
def insights():
    return render_template("insights.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get data from form
        form_data = request.form

        # Preprocess
        input_df = preprocess_input(form_data)

        # Predict
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]

        # Format Result
        result = "High Risk (Default)" if prediction == 1 else "Low Risk (Approved)"
        risk_score = round(probability * 100, 2)

        return render_template("result.html", prediction=result, probability=risk_score)

    except Exception as e:
        return f"Error: {str(e)}"


if __name__ == "__main__":
    app.run(debug=True)
