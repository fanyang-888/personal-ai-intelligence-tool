from fastapi import FastAPI

from app.api.routes import health
from app.logging_config import configure_logging

configure_logging()

app = FastAPI(title="Personal AI Intelligence Tool API", version="0.1.0")

app.include_router(health.router)
