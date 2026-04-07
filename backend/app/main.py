from fastapi import FastAPI

from app.api.routes import health

app = FastAPI(title="Personal AI Intelligence Tool API", version="0.1.0")

app.include_router(health.router)
