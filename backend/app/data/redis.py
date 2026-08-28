from redis.asyncio import Redis
from ..config import db_settings

#
# _token_blacklist = Redis(
#     host=db_settings.REDIS_HOST,
#     port=db_settings.REDIS_PORT,
#     db=0,
# )
_token_blacklist = Redis.from_url(db_settings.REDIS_URL, db=0)


async def add_jti_to_blacklist(jti: str, ttl_seconds: int = 15 * 60):
    await _token_blacklist.set(jti, "blacklisted", ex=ttl_seconds)


async def is_blacklisted(jti: str) -> bool:
    return bool(await _token_blacklist.exists(jti))


async def close_redis():
    await _token_blacklist.aclose()
