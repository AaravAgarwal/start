import requests
from transformers import pipeline
import json
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
import statistics
import firebase_admin
from firebase_admin import credentials, firestore
from apscheduler.schedulers.background import BackgroundScheduler
from tqdm import tqdm
import time

API_KEY = "e96da1c20b664519bf4685d33c67a674"
sentiment_pipeline = pipeline("text-classification", model="ProsusAI/finbert")
from initfb import get_db
INDUSTRY_KEYWORDS = {
    "finance": ["stock market", "banking", "investment", "cryptocurrency"],
    "technology": ["AI", "machine learning", "cybersecurity", "blockchain"],
    "healthcare": ["pharmaceutical", "biotech", "vaccine", "medical research"],
    "energy": ["renewable energy", "oil", "solar power", "nuclear energy"],
    "automotive": ["electric vehicle", "autonomous driving", "Tesla", "EV market"],
    "retail": ["e-commerce", "online shopping", "brick-and-mortar", "retail industry"],
    "entertainment": ["streaming", "movies", "music", "celebrities"],
    "education": ["online learning", "edtech", "remote education", "learning platforms"],
    "real estate": ["property market", "housing", "commercial real estate", "mortgage rates"],
    "manufacturing": ["supply chain", "logistics", "industrial production", "manufacturing industry"],
    "transportation": ["ride-sharing", "autonomous vehicles", "public transport", "mobility services"],
    "agriculture": ["farming", "agtech", "food security", "agricultural industry"],
    "consulting": ["management consulting", "strategy consulting", "consulting industry", "business advisory"]
}

db = get_db()

def update_market_sentiment():
    print("Updating Market Sentiment...")
    url = f"https://newsapi.org/v2/top-headlines?category=business&apiKey={API_KEY}"
    response = requests.get(url).json()
    
    sentiments = []
    for article in tqdm(response.get("articles", []), desc="Processing Market Articles"):
        title = article.get("title", "No title")
        sentiment = sentiment_pipeline(title)[0]['label']
        sentiments.append(1 if sentiment == "positive" else (-1 if sentiment == "negative" else 0))
    
    overall_sentiment_score = statistics.mean(sentiments) if sentiments else 0
    db.collection("sentiments").document("market").set({"overall_market_sentiment": overall_sentiment_score, "timestamp": datetime.utcnow()})
    print("Market Sentiment Updated Successfully.")

def update_industry_sentiment(industry):
    print(f"Updating Sentiment for {industry}...")
    keywords = INDUSTRY_KEYWORDS.get(industry, [industry])
    query = " OR ".join(keywords)
    
    past_week_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    url = f"https://newsapi.org/v2/everything?q={query}&from={past_week_date}&sortBy=publishedAt&apiKey={API_KEY}"
    
    response = requests.get(url).json()
    articles = []
    sentiments = []
    for article in tqdm(response.get("articles", []), desc=f"Processing {industry.capitalize()} Articles"):
        title = article.get("title", "No title")
        sentiment = sentiment_pipeline(title)[0]['label']
        sentiment_value = 1 if sentiment == "positive" else (-1 if sentiment == "negative" else 0)
        sentiments.append(sentiment_value)
        articles.append({
            "title": title,
            "sentiment": sentiment,
            "source": article.get("source", {}).get("name", "Unknown"),
            "link": article.get("url", "#"),
            "published": article.get("publishedAt", "No date")
        })
    
    overall_industry_sentiment = statistics.mean(sentiments) if sentiments else 0
    db.collection("sentiments").document(industry).set({
        "industry": industry,
        "articles": articles,
        "overall_sentiment": overall_industry_sentiment,
        "timestamp": datetime.utcnow()
    })
    print(f"{industry.capitalize()} Sentiment Updated Successfully.")

scheduler = BackgroundScheduler()
scheduler.add_job(update_market_sentiment, 'interval', hours=1)
scheduler.add_job(lambda: [update_industry_sentiment(ind) for ind in INDUSTRY_KEYWORDS.keys()], 'interval', hours=1)
scheduler.start()

if __name__ == "__main__":
    print("Starting Sentiment Updates...")
    update_market_sentiment()
    for industry in tqdm(INDUSTRY_KEYWORDS.keys(), desc="Updating Industry Sentiments"):
        update_industry_sentiment(industry)
    print("All Sentiments Updated. Running Scheduler...")
    while True:
        time.sleep(60)
