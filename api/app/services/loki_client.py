import httpx
from app.configuration.settings import settings
from app.utils.formatter import format_loki_streams

async def fetch_logs():
    query = '{job="fail2ban"}'
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.LOKI_URL}/loki/api/v1/query",
            params={"query": query}
        )
        response.raise_for_status()
        return format_loki_streams(response.json())
