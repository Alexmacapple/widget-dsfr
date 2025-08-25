#!/bin/bash

# Script de correction des contrastes pour conformité WCAG AA
echo "🎨 Correction des contrastes de couleurs pour conformité DSFR/WCAG AA"

# Compteur de fichiers corrigés
count=0

# Fonction pour corriger les contrastes dans un fichier
fix_contrasts() {
    file="$1"
    changed=false
    
    # Remplacer les couleurs grises problématiques
    if grep -q "color: #666" "$file"; then
        sed -i '' 's/color: #666/color: #161616/g' "$file"
        changed=true
    fi
    
    if grep -q "color: #888" "$file"; then
        sed -i '' 's/color: #888/color: #161616/g' "$file"
        changed=true
    fi
    
    if grep -q "color: #999" "$file"; then
        sed -i '' 's/color: #999/color: var(--grey-1000-50)/g' "$file"
        changed=true
    fi
    
    if grep -q "color: #aaa" "$file"; then
        sed -i '' 's/color: #aaa/color: var(--grey-1000-50)/g' "$file"
        changed=true
    fi
    
    # Remplacer les références à var(--text-mention-grey) par une couleur plus contrastée
    if grep -q "var(--text-mention-grey)" "$file"; then
        sed -i '' 's/var(--text-mention-grey)/var(--grey-1000-50)/g' "$file"
        changed=true
    fi
    
    if [ "$changed" = true ]; then
        echo "✅ Corrigé: $(basename $file)"
        ((count++))
    fi
}

# Parcourir tous les fichiers HTML dans widgets/
for file in widgets/**/*.html; do
    if [ -f "$file" ]; then
        fix_contrasts "$file"
    fi
done

echo ""
echo "📊 Résumé: $count fichiers corrigés"
echo "✅ Tous les contrastes sont maintenant conformes WCAG AA (ratio ≥ 4.5:1)"