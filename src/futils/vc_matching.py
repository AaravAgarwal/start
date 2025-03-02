import pandas as pd
filepath = "vc_data.csv"
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Blueprint
import os

vc = Blueprint("vc", __name__)
FILEPATH = os.path.join(os.path.dirname(__file__), "vc_data.csv")

def clean_data(filepath):
    df = pd.read_csv(filepath)
    df['First cheque minimum'] = pd.to_numeric(df['First cheque minimum'], errors='coerce')
    df['First cheque maximum'] = pd.to_numeric(df['First cheque maximum'], errors='coerce')
    return df

def filter_vcs(df, location=None, stage=None, min_cheque=None, max_cheque=None, investor_type=None):
    filtered_df = df.copy()
    
    # Print column names to debug
    print(f"Available columns: {filtered_df.columns.tolist()}")
    
    # Optional: Print a sample row to see the data format
    if not filtered_df.empty:
        print(f"Sample row data: {filtered_df.iloc[0].to_dict()}")
    
    # Handle location filter
    if location and location.strip():
        location_columns = []
        if 'Countries of investment' in filtered_df.columns:
            location_columns.append('Countries of investment')
        if 'Global HQ' in filtered_df.columns:
            location_columns.append('Global HQ')
        
        if location_columns:
            location_mask = False
            for col in location_columns:
                location_mask = location_mask | filtered_df[col].fillna('').astype(str).str.contains(location, case=False)
            filtered_df = filtered_df[location_mask]
            print(f"After location filter ({location}): {len(filtered_df)} records")
        else:
            print("Warning: Location columns not found in data")
    
    if stage and stage.strip():
        if 'Stage of investment' in filtered_df.columns:
            # Convert both sides to string and do case-insensitive partial matching
            filtered_df = filtered_df[
                filtered_df['Stage of investment'].fillna('').astype(str).str.contains(stage, case=False)
            ]
            print(f"After stage filter ({stage}): {len(filtered_df)} records")
        else:
            print("Warning: 'Stage of investment' column not found in data")
    
    # Handle min_cheque with more robust checks
    if min_cheque is not None:
        if 'First cheque minimum' in filtered_df.columns:
            # Ensure numeric conversion and handle NaNs
            filtered_df['First cheque minimum'] = pd.to_numeric(filtered_df['First cheque minimum'], errors='coerce')
            filtered_df = filtered_df[
                (filtered_df['First cheque minimum'] >= min_cheque) | 
                (filtered_df['First cheque minimum'].isna())
            ]
            print(f"After min_cheque filter ({min_cheque}): {len(filtered_df)} records")
        else:
            print("Warning: 'First cheque minimum' column not found in data")
    
    # Handle max_cheque with more robust checks
    if max_cheque is not None:
        if 'First cheque maximum' in filtered_df.columns:
            # Ensure numeric conversion and handle NaNs
            filtered_df['First cheque maximum'] = pd.to_numeric(filtered_df['First cheque maximum'], errors='coerce')
            filtered_df = filtered_df[
                (filtered_df['First cheque maximum'] <= max_cheque) | 
                (filtered_df['First cheque maximum'].isna())
            ]
            print(f"After max_cheque filter ({max_cheque}): {len(filtered_df)} records")
        else:
            print("Warning: 'First cheque maximum' column not found in data")
    
    # Handle investor_type with more flexible matching
    if investor_type and investor_type.strip():
        if 'Investor type' in filtered_df.columns:
            filtered_df = filtered_df[
                filtered_df['Investor type'].fillna('').astype(str).str.contains(investor_type, case=False)
            ]
            print(f"After investor_type filter ({investor_type}): {len(filtered_df)} records")
        else:
            print("Warning: 'Investor type' column not found in data")
    
    return filtered_df

@vc.route("/vcs", methods=["GET"])
def get_vcs():
    location = request.args.get("location", "")
    stage = request.args.get("stage", "")
    investor_type = request.args.get("investor_type", "")
    percentage = request.args.get("percentage", "30")  # Default to 100% results

    try:
        min_cheque = float(request.args.get("min_cheque")) if request.args.get("min_cheque") else None
    except ValueError:
        min_cheque = None
    try:
        max_cheque = float(request.args.get("max_cheque")) if request.args.get("max_cheque") else None
    except ValueError:
        max_cheque = None
    try:
        percentage = float(percentage)
        if percentage < 0 or percentage > 100:
            raise ValueError
    except ValueError:
        percentage = 100  # Default to full results if invalid

    df = clean_data(FILEPATH)
    filtered_vcs = filter_vcs(df, location, stage, min_cheque, max_cheque, investor_type)

    print(f"Total results after filtering: {len(filtered_vcs)}")

    # Sample only a percentage of the results
    if 0 < percentage < 100:
        sample_size = int(len(filtered_vcs) * (percentage / 100))
        filtered_vcs = filtered_vcs.sample(n=sample_size, random_state=42)  # Random but reproducible

    print(f"Returning {len(filtered_vcs)} results ({percentage}% of filtered data).")

    filtered_vcs = filtered_vcs.replace({float('nan'): None})
    results = filtered_vcs.to_dict(orient="records")
    return jsonify(results)