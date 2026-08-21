import os
import io
import PyPDF2
from typing import Dict, Any, Optional

class PDFProcessor:
    @staticmethod
    def extract_metadata(file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Extract metadata from PDF bytes"""
        title = filename.replace(".pdf", "").replace("[-_]", " ")
        author = "Unknown"
        pages = 0
        
        try:
            reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            pages = len(reader.pages)
            meta = reader.metadata or {}
            
            if meta.get("/Title"):
                pdf_title = str(meta.get("/Title")).strip()
                if pdf_title and len(pdf_title) > 2:
                    title = pdf_title
                    
            if meta.get("/Author"):
                pdf_author = str(meta.get("/Author")).strip()
                if pdf_author and len(pdf_author) > 1:
                    author = pdf_author
        except Exception as e:
            print(f"Error reading PDF metadata for {filename}: {e}")

        # Derive aesthetic palette from title hash
        hue_palettes = [
            {"cloth": "#181f33", "foil": "#a8c5db", "glow": "rgba(168, 197, 219, 0.22)"}, # Indigo/Ice
            {"cloth": "#683b1d", "foil": "#df9652", "glow": "rgba(223, 150, 82, 0.22)"},  # Sienna/Bronze
            {"cloth": "#1e3826", "foil": "#e5c468", "glow": "rgba(229, 196, 104, 0.22)"}, # Laurel/Gold
            {"cloth": "#421420", "foil": "#e8a598", "glow": "rgba(232, 165, 152, 0.22)"}, # Bordeaux/Rose
            {"cloth": "#162338", "foil": "#e0b852", "glow": "rgba(224, 184, 82, 0.22)"},  # Prussian/Gold
            {"cloth": "#1e2024", "foil": "#dc8448", "glow": "rgba(220, 132, 72, 0.22)"},  # Charcoal/Copper
            {"cloth": "#162842", "foil": "#f5d36e", "glow": "rgba(245, 211, 110, 0.24)"}   # Celestial/Gold
        ]
        
        hash_val = sum(ord(c) for c in filename) % len(hue_palettes)
        palette = hue_palettes[hash_val]

        return {
            "title": title,
            "author": author,
            "pages": pages,
            "cloth_color": palette["cloth"],
            "foil_color": palette["foil"],
            "theme_glow": palette["glow"]
        }
