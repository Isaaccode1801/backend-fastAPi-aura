from pydantic_settings import BaseSettings 

class Settings(BaseSettings):
    database_url: str = "" #colocar a url do banco de dados aqui nath 

    class Config:
        env_file = ".env"

settings = Settings()