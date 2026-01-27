import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

# 1. Quotes add kiye aur +asyncpg driver lagaya
NEON_URL = "postgresql+asyncpg://neondb_owner:npg_MosLOzD72kiG@ep-silent-salad-a444mue3-pooler.us-east-1.aws.neon.tech/neondb"

async def fix():
    # 2. Variable name match kar diya (NEON_URL)
    engine = create_async_engine(
        NEON_URL,
        connect_args={"ssl": True}
    )
    
    async with engine.begin() as conn:
        print("Neon cloud se connection ban raha hai...")
        try:
            # Column add karne ki koshish
            await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);"))
            print("Mubarak ho! 'full_name' column Neon database mein add ho gaya.")
        except Exception as e:
            print(f"Error: {e}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(fix())