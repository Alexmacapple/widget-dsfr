#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Remplace les caractères accentués par leurs entités HTML
"""

import os
import glob

def replace_accents(text):
    """Remplace les caractères accentués par leurs entités HTML"""
    replacements = {
        'À': '&Agrave;',
        'Â': '&Acirc;',
        'Ä': '&Auml;',
        'à': '&agrave;',
        'â': '&acirc;',
        'ä': '&auml;',
        'É': '&Eacute;',
        'È': '&Egrave;',
        'Ê': '&Ecirc;',
        'Ë': '&Euml;',
        'é': '&eacute;',
        'è': '&egrave;',
        'ê': '&ecirc;',
        'ë': '&euml;',
        'Ï': '&Iuml;',
        'Î': '&Icirc;',
        'ï': '&iuml;',
        'î': '&icirc;',
        'Ô': '&Ocirc;',
        'Ö': '&Ouml;',
        'ô': '&ocirc;',
        'ö': '&ouml;',
        'Ù': '&Ugrave;',
        'Û': '&Ucirc;',
        'Ü': '&Uuml;',
        'ù': '&ugrave;',
        'û': '&ucirc;',
        'ü': '&uuml;',
        'Ÿ': '&Yuml;',
        'ÿ': '&yuml;',
        'Ç': '&Ccedil;',
        'ç': '&ccedil;',
        'Ñ': '&Ntilde;',
        'ñ': '&ntilde;',
        'œ': '&oelig;',
        'Œ': '&OElig;',
        '€': '&euro;',
        '°': '&deg;',
        '«': '&laquo;',
        '»': '&raquo;',
        '"': '&ldquo;',
        '"': '&rdquo;',
        '–': '&ndash;',
        '—': '&mdash;',
        '…': '&hellip;'
    }
    
    for char, entity in replacements.items():
        text = text.replace(char, entity)
    
    return text

def fix_file(filepath):
    """Corrige un fichier HTML"""
    try:
        # Lire le fichier
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remplacer les accents
        fixed_content = replace_accents(content)
        
        # Réécrire le fichier
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print(f"✓ Corrigé: {os.path.basename(filepath)}")
        return True
    except Exception as e:
        print(f"✗ Erreur pour {filepath}: {e}")
        return False

def main():
    # Trouver tous les fichiers HTML dans widgets/charts
    charts_dir = '/Users/alex/Desktop/widget-dsfr/widgets/charts'
    html_files = glob.glob(os.path.join(charts_dir, '*.html'))
    
    print(f"Remplacement des accents par entités HTML dans {len(html_files)} fichiers...")
    print("-" * 50)
    
    fixed = 0
    for filepath in html_files:
        if fix_file(filepath):
            fixed += 1
    
    print("-" * 50)
    print(f"✅ {fixed}/{len(html_files)} fichiers corrigés")
    print("\nLes caractères accentués ont été remplacés par leurs entités HTML.")
    print("Cela garantit un affichage correct quel que soit l'encodage du serveur.")

if __name__ == "__main__":
    main()