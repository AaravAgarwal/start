from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, firestore
#from .futils.vc import get_matches, clean_data
# from futils.vc import vc
from business_plan import bp
from futils.vc_matching import vc
from initfb import get_db

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

db = get_db()

app.register_blueprint(bp, url_prefix="/api")

app.register_blueprint(vc, url_prefix="/api")

@app.route('/')
def hello_world():
    return 'Hello World'

@app.route("/get_sentiments/<uid>")
def get_sentiments(uid):
    try:
        user = db.collection("users").document(uid).get()
        sector = user.to_dict()["sector"].lower()
        doc_ref = db.collection("sentiments").document(sector).get()
        
        return jsonify({"news": doc_ref.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

@app.route("/verify_token", methods=["POST"])
def verify_token():
    try:
        data = request.get_json()
        id_token = data.get("token")

        # Verify ID token using Firebase Admin SDK
        decoded_token = auth.verify_id_token(id_token)

        # Get UID and Email
        uid = decoded_token["uid"]

        # Query for UID in DB
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "user not fully registered"}), 401

        # Convert document data to dictionary
        user_data = user_doc.to_dict()
        user_data["uid"] = uid  # Ensure UID is included in the response

        return jsonify({"message": "User verified", "user": user_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 401

@app.route("/onboarding", methods=["POST"])
def onboarding():
    try:
        data = request.get_json()
        data["chiefs"] = {chair["name"]: chair["email"] for chair in data["chiefs"]}    
        
        default_unit_economics = {
            "aov": 0,
            "cac": 0,
            "isOpen": False,
            "category": "Other",
            "enableChurn": True,
            "churn": 0,
            "cogs": {"Manufacture": 0, "Package": 0},
            "ltv": 0,
            "margin": 0,
            "marginRate": 0,
            "ratio": 0,
            "order": 0
        }

        default_valuation = {
            "revenue": 0,
            "marketSize": 0,
            "som": 0,
            "outflow": 1,
            "growth": 0,
            "numYears": 1,
            "equityValue": 0,
            "debtValue": 0,
            "tax": 0,
            "equityCost": 0,
            "debtCost": 0
        }

        user_data = {**data, "unitEconomics": default_unit_economics, "valuation": default_valuation}


        db.collection("users").document(user_data["uid"]).set(user_data, merge=True)

        uid = data['uid']

        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()


        # Convert document data to dictionary
        user_data = user_doc.to_dict()
        user_data["uid"] = uid  # Ensure UID is included in the response

        return jsonify({"message": "User verified", "user": user_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/api/<attribute>/<user_uid>', methods=['GET'])
def get_unit_economics(attribute, user_uid):
    user_ref = db.collection('users').document(user_uid)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return jsonify({"error": "user not fully registered"}), 401

    # Convert document data to dictionary
    user_data = user_doc.to_dict()

    # Extract 'unitEconomics' field
    query = user_data.get(attribute)

    if query:
        return jsonify(query), 200
    else:
        return jsonify({"error": "User not found"}), 404

# Route to update unit economics data
@app.route('/api/<attribute>/<user_uid>', methods=['POST'])
def update_unit_economics(attribute, user_uid):
    try:
        data = request.get_json()

        user_ref = db.collection('users').document(user_uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "user not fully registered"}), 401

        # Convert document data to dictionary
        user_data = user_doc.to_dict()

        # Extract 'unitEconomics' field
        query = user_data.get(attribute)

        # If 'unitEconomics' exists, update it with the new data
        if query:
            # Update 'unitEconomics' with the new data
            user_ref.update({
                attribute : firestore.DELETE_FIELD  # This will delete the old 'unitEconomics' field if necessary
            })

            # Now update the 'unitEconomics' field with the new data
            user_ref.update({
                attribute : data
            })

            return jsonify({"message": f"{attribute} updated successfully"}), 200
        else:
            return jsonify({"error": "User's unit economics not found"}), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Error updating unit economics"}), 500


# @app.route("/search", methods=["GET"])
# def search_vc():
#     df = clean_data(filepath)
#     location = request.args.get("location")
#     stage = request.args.get("stage")
#     min_cheque = request.args.get("min_cheque")
#     max_cheque = request.args.get("max_cheque")
#     investor_type = request.args.get("investor_type")

#     results = get_matches(df, location, stage, min_cheque, max_cheque, investor_type)
#     return jsonify(results.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')