import os
from sqlalchemy.orm import Session
from app.models.book import Book
from app.models.collection import Collection, BookCollection

SEED_BOOKS = [
    {
        "id": "vol-no-longer-human",
        "title": "No Longer Human",
        "author": "Osamu Dazai",
        "subtitle": "A Portrait of Alienation & Solitude",
        "description": "No Longer Human by Osamu Dazai is one of modern Japan's most celebrated literary masterpieces. It captures the poignant, deeply introspective journey of Yozo, a man estranged from human society.",
        "year": "1948",
        "pdf_url": "/book/NO LONGER HUMAN - OSAMU DAZAI.pdf",
        "cloth_color": "#181f33",
        "cloth_roughness": "0.88",
        "cloth_metalness": "0.05",
        "foil_color": "#a8c5db",
        "foil_metalness": "0.94",
        "foil_roughness": "0.16",
        "theme_glow": "rgba(168, 197, 219, 0.22)",
        "theme_hue": "#181f33",
        "pages": 176,
        "dimensions": {"width": 1.45, "height": 2.15, "depth": 0.36}
    },
    {
        "id": "vol-the-fall-outsider",
        "title": "The Fall & The Outsider",
        "author": "Albert Camus",
        "subtitle": "Absurdity, Freedom & Moral Isolation",
        "description": "Two essential philosophical masterpieces by Nobel laureate Albert Camus exploring the confrontation between human longing for meaning and the silent absurdity of the universe.",
        "year": "1942 · 1956",
        "pdf_url": "/book/Camus, Albert - The Fall and The Outsider [tr. Gilbert] (Lythway, 1977).pdf",
        "cloth_color": "#683b1d",
        "cloth_roughness": "0.85",
        "cloth_metalness": "0.05",
        "foil_color": "#df9652",
        "foil_metalness": "0.95",
        "foil_roughness": "0.18",
        "theme_glow": "rgba(223, 150, 82, 0.22)",
        "theme_hue": "#683b1d",
        "pages": 240,
        "dimensions": {"width": 1.48, "height": 2.20, "depth": 0.42}
    },
    {
        "id": "vol-early-greek-philosophy",
        "title": "Early Greek Philosophy",
        "author": "John Burnet",
        "subtitle": "The Origins of Cosmology & Rational Enquiry",
        "description": "John Burnet's monumental scholarly treatise on the Pre-Socratics—from Thales, Anaximander, and Heraclitus to Parmenides and Democritus. It chronicles the birth of natural science and systematic Western thought.",
        "year": "1892",
        "pdf_url": "/book/EARLY GREEK PHILOSOPHY.pdf",
        "cloth_color": "#1e3826",
        "cloth_roughness": "0.86",
        "cloth_metalness": "0.05",
        "foil_color": "#e5c468",
        "foil_metalness": "0.96",
        "foil_roughness": "0.14",
        "theme_glow": "rgba(229, 196, 104, 0.22)",
        "theme_hue": "#1e3826",
        "pages": 412,
        "dimensions": {"width": 1.55, "height": 2.30, "depth": 0.46}
    },
    {
        "id": "vol-forbidden-knowledge",
        "title": "Forbidden Knowledge",
        "author": "Roger Shattuck",
        "subtitle": "From Prometheus to the Frontiers of Inquiry",
        "description": "A profound inquiry into the moral, scientific, and aesthetic limits of human knowledge. Shattuck explores the myths of Prometheus, Eden, Faust, and Frankenstein.",
        "year": "1996",
        "pdf_url": "/book/FORBIDDEN KNOWLEDGE - PROMETHEUS TO PORNOGRAPHY.pdf",
        "cloth_color": "#421420",
        "cloth_roughness": "0.87",
        "cloth_metalness": "0.05",
        "foil_color": "#e8a598",
        "foil_metalness": "0.94",
        "foil_roughness": "0.18",
        "theme_glow": "rgba(232, 165, 152, 0.22)",
        "theme_hue": "#421420",
        "pages": 384,
        "dimensions": {"width": 1.62, "height": 2.35, "depth": 0.50}
    },
    {
        "id": "vol-central-banking",
        "title": "Central Banking & Enslavement",
        "author": "Stephen M. Goodson",
        "subtitle": "Monetary Power, Sovereignty & Economic Systems",
        "description": "An extensive historical survey by former South African Reserve Bank director Stephen Goodson, tracing the evolution of central banking, debt architectures, and state monetary sovereignty.",
        "year": "2014",
        "pdf_url": "/book/A HISTORY OF CENTRAL BANKING AND THE ENSLAVEMENT OF MANKIND.pdf",
        "cloth_color": "#162338",
        "cloth_roughness": "0.88",
        "cloth_metalness": "0.05",
        "foil_color": "#e0b852",
        "foil_metalness": "0.96",
        "foil_roughness": "0.15",
        "theme_glow": "rgba(224, 184, 82, 0.22)",
        "theme_hue": "#162338",
        "pages": 220,
        "dimensions": {"width": 1.50, "height": 2.25, "depth": 0.40}
    },
    {
        "id": "vol-dark-psychology",
        "title": "Dark Psychology",
        "author": "Behavioral Studies",
        "subtitle": "Perception, Emotional Dynamics & Influence",
        "description": "An applied analysis of interpersonal perception, nonverbal cues, emotional intelligence, and cognitive defense strategies.",
        "year": "2020",
        "pdf_url": "/book/Dark Psychology - How to Analyze People, and Their Emotional Intelligence To Be Able to Avoid.pdf",
        "cloth_color": "#1e2024",
        "cloth_roughness": "0.86",
        "cloth_metalness": "0.05",
        "foil_color": "#dc8448",
        "foil_metalness": "0.95",
        "foil_roughness": "0.17",
        "theme_glow": "rgba(220, 132, 72, 0.22)",
        "theme_hue": "#1e2024",
        "pages": 190,
        "dimensions": {"width": 1.48, "height": 2.20, "depth": 0.38}
    },
    {
        "id": "vol-untethered-soul",
        "title": "The Untethered Soul",
        "author": "Michael A. Singer",
        "subtitle": "The Journey Beyond Yourself",
        "description": "Michael A. Singer's transformative spiritual classic on mindfulness, consciousness, and liberation from inner limitation.",
        "year": "2007",
        "pdf_url": "/book/The Untethered Soul (Michael A. Singer Michael Alan Singer).pdf",
        "cloth_color": "#162842",
        "cloth_roughness": "0.88",
        "cloth_metalness": "0.05",
        "foil_color": "#f5d36e",
        "foil_metalness": "0.98",
        "foil_roughness": "0.14",
        "theme_glow": "rgba(245, 211, 110, 0.24)",
        "theme_hue": "#162842",
        "pages": 200,
        "dimensions": {"width": 1.46, "height": 2.18, "depth": 0.38}
    }
]

def seed_default_collection_if_empty(db: Session):
    from app.models.user import User
    from app.core.security import get_password_hash

    # Ensure master user 'harsh' exists
    master_user = db.query(User).filter(User.username == "harsh").first()
    if not master_user:
        print("[Seeder] Creating master user 'harsh'...")
        master_user = User(
            id="user-harsh",
            username="harsh",
            email="harsh@vivlio.library",
            password_hash=get_password_hash("0219"),
            preferences={"theme": "medieval", "volume": 0.8}
        )
        db.add(master_user)
        db.commit()

    existing_count = db.query(Book).count()
    if existing_count > 0:
        return

    print("[Seeder] Seeding default collection of 7 books into library database...")
    
    # Create default Main Shelf collection
    main_collection = Collection(
        id="col-main-shelf",
        name="The Main Shelf",
        description="The primary 3D clothbound personal collection.",
        theme={"color": "#1a2238", "foil": "#d4af37"},
        sort_order=0
    )
    db.add(main_collection)
    db.commit()

    for idx, b_data in enumerate(SEED_BOOKS):
        book = Book(
            id=b_data["id"],
            user_id="default-user",
            title=b_data["title"],
            author=b_data["author"],
            subtitle=b_data["subtitle"],
            description=b_data["description"],
            year=b_data["year"],
            pdf_url=b_data["pdf_url"],
            cloth_color=b_data["cloth_color"],
            cloth_roughness=b_data["cloth_roughness"],
            cloth_metalness=b_data["cloth_metalness"],
            foil_color=b_data["foil_color"],
            foil_metalness=b_data["foil_metalness"],
            foil_roughness=b_data["foil_roughness"],
            theme_glow=b_data["theme_glow"],
            theme_hue=b_data["theme_hue"],
            pages=b_data["pages"],
            dimensions=b_data["dimensions"]
        )
        db.add(book)
        
        # Link to main collection
        junction = BookCollection(
            book_id=b_data["id"],
            collection_id="col-main-shelf",
            position=idx
        )
        db.add(junction)

    db.commit()
    print("[Seeder] Successfully seeded 7 books into library database!")
