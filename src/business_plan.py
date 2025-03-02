from flask import Blueprint, request, jsonify
from google.cloud import firestore
import uuid
import requests
from flask_cors import CORS, cross_origin
import firebase_admin
from firebase_admin import credentials, firestore
from initfb import get_db
import traceback

bp = Blueprint("bp", __name__)

db = get_db()

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent"
GEMINI_API_KEY = "AIzaSyClvSdWRPXspW4IzwQT-p6tO6QBz78Ej8E"
HEADERS = {"Content-Type": "application/json"}

SYSTEM_MESSAGE = "You are an AI assistant providing structured feedback on business plans. Stay focused on startup strategy, market positioning, and execution feasibility."

@bp.route("/feedback/start", methods=["POST"])
@cross_origin()
def start_feedback():
    try:
        data = request.json
        user_id = data.get("user_id")
        required_fields = ["venture_name", "location", "mission", "what"]

        if not user_id or not all(field in data and data[field] for field in required_fields):
            return jsonify({"error": "User ID and all required fields (venture_name, location, mission, what) must be provided."}), 400

        session_id = str(uuid.uuid4())

        optional_fields = {
            "business_overview": {
                "sales_marketing": data.get("sales_marketing"),
                "operations": data.get("operations"),
                "finance": data.get("finance")
            },
            "company_strategy": {
                "result_created": data.get("result_created"),
                "how_result_created": data.get("how_result_created"),
                "who_served": data.get("who_served"),
                "why_doing_this": data.get("why_doing_this"),
                "why_customers_choose": data.get("why_customers_choose"),
                "step_by_step_plan": data.get("step_by_step_plan")
            },
            "market_strategy": {
                "demographics": data.get("demographics"),
                "psychographics": data.get("psychographics"),
                "size_target_market": data.get("size_target_market"),
                "where_find_customers": data.get("where_find_customers"),
                "visibility_strategy": data.get("visibility_strategy"),
                "lead_generation_strategy": data.get("lead_generation_strategy"),
                "conversion_strategy": data.get("conversion_strategy")
            },
            "products": data.get("products", []), 
            "goals": {
                "one_year": data.get("one_year_goal"),
                "five_year_plus": data.get("five_year_plus_goal")
            }
        }

        optional_fields = {
            k: v for k, v in optional_fields.items() 
            if (isinstance(v, dict) and any(v.values()))  
            or (isinstance(v, list) and len(v) > 0)      
        }    

        db.collection("users").document(user_id).collection("businessplan").document(session_id).set({
            "venture_name": data["venture_name"],
            "location": data["location"],
            "mission": data["mission"],
            "what": data["what"],
            "optional": optional_fields,
            "created_at": firestore.SERVER_TIMESTAMP
        })

        prompt_text = (
            SYSTEM_MESSAGE + "\n\n"
            f"Venture Name: {data['venture_name']}\n"
            f"Location: {data['location']}\n"
            f"Mission: {data['mission']}\n"
            f"What: {data['what']}\n\n"
            f"Provide an initial assessment of this business plan."
        )

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt_text}]
                }
            ]
        }

        # print(f"Sending initial feedback request to Gemini API: {payload}")  

        response = requests.post(f"{GEMINI_API_URL}?key={GEMINI_API_KEY}", json=payload, headers=HEADERS)

        if response.status_code != 200:
            print(f"Error from Gemini API: {response.text}")  
            return jsonify({"error": "Failed to get response from LLM.", "details": response.text}), 500

        try:
            llm_response = response.json()
            # print(f" Gemini API Initial Feedback: {llm_response}")  

            if "candidates" in llm_response and len(llm_response["candidates"]) > 0:
                llm_text = llm_response["candidates"][0]["content"]["parts"][0]["text"]
            else:
                llm_text = "No response generated."

        except Exception as e:
            print(f"Error parsing Gemini response: {e}")
            return jsonify({"error": "Error parsing Gemini response."}), 500

        db.collection("users").document(user_id).collection("businessplan").document(session_id).collection("messages").add({
            "role": "llm",
            "message": llm_text,
            "timestamp": firestore.SERVER_TIMESTAMP
        })

        return jsonify({"session_id": session_id, "message": "Feedback session started.", "initial_response": llm_text})

    except Exception as e:
        print(f"Server error: {e}")  
        traceback.print_exc()  
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@bp.route("/feedback/respond", methods=["POST"])
@cross_origin()
def respond():
    try:
        data = request.json
        user_id = data.get("user_id")
        session_id = data.get("session_id")
        user_message = data.get("message")

        if not user_id or not session_id or not user_message:
            return jsonify({"error": "User ID, Session ID, and message are required."}), 400

        session_doc = db.collection("users").document(user_id).collection("businessplan").document(session_id).get()
        if not session_doc.exists:
            return jsonify({"error": "Session not found."}), 404

        session_data = session_doc.to_dict()

        db.collection("users").document(user_id).collection("businessplan").document(session_id).collection("messages").add({
            "role": "user",
            "message": user_message,
            "timestamp": firestore.SERVER_TIMESTAMP
        })

        prompt_text = (
            SYSTEM_MESSAGE + "\n\n"
            f"Venture Name: {session_data['venture_name']}\n"
            f"Location: {session_data['location']}\n"
            f"Mission: {session_data['mission']}\n"
            f"What: {session_data['what']}\n\n"
            f"User Input: {user_message}"
        )

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{ "text": prompt_text }]
                }
            ]
        }

        # print(f" Sending request to Gemini API: {payload}")  

        response = requests.post(f"{GEMINI_API_URL}?key={GEMINI_API_KEY}", json=payload, headers=HEADERS)

        if response.status_code != 200:
            print(f" Error from Gemini API: {response.text}") 
            return jsonify({"error": "Failed to get response from LLM.", "details": response.text}), 500

        try:
            llm_response = response.json()
            # print(f"Gemini API Response: {llm_response}")  

            if "candidates" in llm_response and len(llm_response["candidates"]) > 0:
                llm_text = llm_response["candidates"][0]["content"]["parts"][0]["text"]
            else:
                llm_text = "No response generated."

        except Exception as e:
            # print(f" Error parsing Gemini response: {e}")
            return jsonify({"error": "Error parsing Gemini response."}), 500

        db.collection("users").document(user_id).collection("businessplan").document(session_id).collection("messages").add({
            "role": "llm",
            "message": llm_text,
            "timestamp": firestore.SERVER_TIMESTAMP
        })

        return jsonify({"response": llm_text})

    except Exception as e:
        print(f" Server error: {e}")  # 
        traceback.print_exc()  # 
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


@bp.route("/feedback/history", methods=["GET"])
@cross_origin()
def get_history():
    user_id = request.args.get("user_id")
    session_id = request.args.get("session_id")
    if not user_id or not session_id:
        return jsonify({"error": "User ID and Session ID are required."}), 400
    
    messages_ref = db.collection("users").document(user_id).collection("businessplan").document(session_id).collection("messages").order_by("timestamp").stream()
    history = [{"role": msg.to_dict()["role"], "message": msg.to_dict()["message"]} for msg in messages_ref]
    
    return jsonify({"history": history})

@bp.route("/feedback/latest", methods=["GET"])
@cross_origin()
def get_latest_chat():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "User ID is required."}), 400

    print(f"🔄 Fetching latest chat for user: {user_id}")

    # Ensure only the current user's chats are fetched
    chats = db.collection("users").document(user_id).collection("businessplan")\
        .order_by("created_at", direction=firestore.Query.DESCENDING).limit(1).stream()

    latest_chat = next(chats, None)

    if not latest_chat:
        return jsonify({"error": "No chat sessions found."}), 404

    return jsonify({"session_id": latest_chat.id})