from pydantic import BaseSettings

class Settings(BaseSettings):
    LOKI_URL: str = "http://localhost:3100" # cambiar cuando se tenga la url de loki, usar .env

    class Config:
        env_file = ".env"

settings = Settings()
