from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
from .config import security_settings


def generate_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)):
    to_encode = data.copy()
    return jwt.encode(
        payload={
            **to_encode,
            "exp": expires_delta + datetime.now(timezone.utc),
            "jti": str(uuid4()),
        },
        key=security_settings.JWT_SECRET,
        algorithm=security_settings.JWT_ALGORITHM,
    )


def decode_access_token(token: str) -> dict | None:
    try:
        t = jwt.decode(
            jwt=token,
            key=security_settings.JWT_SECRET,
            algorithms=[security_settings.JWT_ALGORITHM],
        )
        return t
    except jwt.InvalidTokenError:
        return None

    except jwt.PyJWKError:
        return None
