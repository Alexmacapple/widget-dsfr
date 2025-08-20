#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour corriger l'encodage des fichiers HTML
"""

import os
import glob
import codecs

def fix_file_encoding(filepath):
    """Lit un fichier et le réécrit en UTF-8 avec BOM"""
    try:
        # Essayer de lire avec différents encodages
        content = None
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    content = f.read()
                print(f"Lu {filepath} avec encoding {encoding}")
                break
            except:
                continue
        
        if content:
            # Réécrire en UTF-8 sans BOM
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Corrigé: {filepath}")
            return True
    except Exception as e:
        print(f"✗ Erreur pour {filepath}: {e}")
        return False

def main():
    # Trouver tous les fichiers HTML dans widgets/charts
    charts_dir = '/Users/alex/Desktop/widget-dsfr/widgets/charts'
    html_files = glob.glob(os.path.join(charts_dir, '*.html'))
    
    print(f"Correction de l'encodage pour {len(html_files)} fichiers...")
    
    fixed = 0
    for filepath in html_files:
        if fix_file_encoding(filepath):
            fixed += 1
    
    print(f"\n✅ {fixed}/{len(html_files)} fichiers corrigés")
    print("\nUtilisez maintenant le serveur avec: python3 serve-utf8.py")

if __name__ == "__main__":
    main()