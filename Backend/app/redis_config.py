import redis
import json
import os
from dotenv import load_dotenv

load_dotenv()

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", "6379")),
    db=0,
    decode_responses=True
)

def get_cache_key(endpoint: str, user_id: int, **params) -> str:
    """Generate consistent cache keys"""
    return f"{endpoint}:user_{user_id}:{':'.join(f'{k}_{v}' for k, v in sorted(params.items()))}"