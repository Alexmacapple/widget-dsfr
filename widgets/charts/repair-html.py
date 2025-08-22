#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour réparer les fichiers HTML corrompus par le remplacement incorrect des guillemets
"""

import os
import glob

def repair_html_file(filepath):
    """Répare un fichier HTML en restaurant les guillemets dans les attributs"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remplacer &rdquo; par " (guillemets droits normaux)
    content = content.replace('&rdquo;', '"')
    
    # Remplacer &ldquo; par " (guillemets droits normaux)
    content = content.replace('&ldquo;', '"')
    
    # Sauvegarder le fichier réparé
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Réparé: {os.path.basename(filepath)}")

def main():
    # Obtenir tous les fichiers HTML dans le répertoire
    html_files = glob.glob('*.html')
    
    if not html_files:
        print("Aucun fichier HTML trouvé dans le répertoire courant")
        return
    
    print(f"Réparation de {len(html_files)} fichiers HTML...")
    print("-" * 40)
    
    for filepath in html_files:
        try:
            repair_html_file(filepath)
        except Exception as e:
            print(f"✗ Erreur pour {filepath}: {e}")
    
    print("-" * 40)
    print("Réparation terminée!")
    print("\nLes fichiers devraient maintenant fonctionner correctement.")
    print("Les caractères accentués restent encodés en UTF-8.")

if __name__ == "__main__":
    main()