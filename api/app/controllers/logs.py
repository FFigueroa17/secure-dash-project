from fastapi import APIRouter, WebSocket
from app.services.loki_client import fetch_logs
import asyncio

router = APIRouter()

@router.get("/logs")
async def get_logs():
    return await fetch_logs()

@router.websocket("/ws/logs")
async def websocket_logs(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            logs = await fetch_logs()
            await websocket.send_json(logs)
            await asyncio.sleep(3)
    except Exception:
        await websocket.close()
