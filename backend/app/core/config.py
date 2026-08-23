from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Senka API"
    database_url: str = "mssql+pyodbc://@localhost\\SQLEXPRESS/senka?driver=ODBC+Driver+18+for+SQL+Server&trusted_connection=yes&TrustServerCertificate=yes"
    jwt_secret: str = "senka-super-secret-jwt-2024"
    jwt_algorithm: str = "HS256"
    allowed_origins: str = "http://localhost:3000"
    app_env: str = "development"

    # Email (Gmail SMTP) — set these in .env for live email
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_email: str = ""          # your.gmail@gmail.com
    smtp_password: str = ""       # Gmail App Password (16-char)
    smtp_enabled: bool = False    # Set True in .env when credentials ready

    # Payment Gateways — set in .env for live payments
    jazzcash_merchant_id: str = ""
    jazzcash_password: str = ""
    jazzcash_integrity_salt: str = ""
    jazzcash_enabled: bool = False

    easypaisa_account: str = ""
    easypaisa_enabled: bool = False

    stripe_publishable_key: str = ""
    stripe_secret_key: str = ""
    stripe_enabled: bool = False

    # Payment fallback mode (bank/cod always available)
    payment_provider: str = "fallback"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
