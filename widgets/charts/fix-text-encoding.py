#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour corriger uniquement les caractères accentués mal encodés dans le texte
Sans toucher aux attributs HTML ni aux guillemets
"""

import os
import glob
import re

def fix_text_encoding(filepath):
    """Corrige les caractères mal encodés dans un fichier HTML"""
    
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    # Remplacements des caractères mal encodés les plus courants
    replacements = {
        '�': 'é',  # é mal encodé
        '�': 'è',  # è probable
        '�': 'à',  # à probable
        'É': 'É',  # Majuscule
        'È': 'È',
        'À': 'À',
        'Â': 'Â',
        'Ê': 'Ê',
        'Î': 'Î',
        'Ô': 'Ô',
        'Û': 'Û',
        'Ç': 'Ç',
        'â': 'â',
        'ê': 'ê',
        'î': 'î',
        'ô': 'ô',
        'û': 'û',
        'ç': 'ç',
        'ù': 'ù',
        'œ': 'œ',
        'æ': 'æ'
    }
    
    # Appliquer les remplacements
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    # Corrections contextuelles spécifiques
    content = content.replace('D�BUT', 'DÉBUT')
    content = content.replace('combin�', 'combiné')
    content = content.replace('combin�e', 'combinée')
    content = content.replace('crois�e', 'croisée')
    content = content.replace('�volution', 'Évolution')
    content = content.replace('cat�gories', 'catégories')
    content = content.replace('cat�gorie', 'catégorie')
    content = content.replace('Contr�les', 'Contrôles')
    content = content.replace('empil�es', 'empilées')
    content = content.replace('empil�', 'empilé')
    content = content.replace('donn�es', 'données')
    content = content.replace('Donn�es', 'Données')
    content = content.replace('L�gende', 'Légende')
    content = content.replace('repr�sentent', 'représentent')
    content = content.replace('F�v', 'Fév')
    content = content.replace('Ao�', 'Aoû')
    content = content.replace('D�c', 'Déc')
    content = content.replace('accessibilit�', 'accessibilité')
    content = content.replace('ins�r�es', 'insérées')
    content = content.replace('simul�es', 'simulées')
    content = content.replace('r�partition', 'répartition')
    content = content.replace('affich�', 'affiché')
    content = content.replace('R�gion', 'Région')
    content = content.replace('R�gions', 'Régions')
    content = content.replace('Rh�ne', 'Rhône')
    content = content.replace('d�tails', 'détails')
    content = content.replace('Pyr�n�es', 'Pyrénées')
    content = content.replace('M�diterran�e', 'Méditerranée')
    content = content.replace('Corse-Proven�e', 'Corse-Provence')
    content = content.replace('C�te', 'Côte')
    content = content.replace('ann�e', 'année')
    content = content.replace('Mise � jour', 'Mise à jour')
    
    # Sauvegarder le fichier corrigé
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Corrigé: {os.path.basename(filepath)}")

def main():
    # Obtenir tous les fichiers HTML dans le répertoire
    html_files = glob.glob('*.html')
    
    if not html_files:
        print("Aucun fichier HTML trouvé dans le répertoire courant")
        return
    
    print(f"Correction de l'encodage de {len(html_files)} fichiers HTML...")
    print("-" * 40)
    
    for filepath in html_files:
        try:
            fix_text_encoding(filepath)
        except Exception as e:
            print(f"✗ Erreur pour {filepath}: {e}")
    
    print("-" * 40)
    print("Correction terminée!")
    print("\nLes caractères accentués devraient maintenant s'afficher correctement.")

if __name__ == "__main__":
    main()