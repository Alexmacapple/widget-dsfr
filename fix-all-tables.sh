#!/bin/bash

# Script pour corriger tous les widgets tables avec les bons noms de champs API

echo "🔧 Correction des noms de champs dans tous les widgets tables..."

# Liste des fichiers à corriger (exclure les fichiers déjà fonctionnels)
files=(
    "widgets/tables/advanced-table-001.html"
    "widgets/tables/aggregate-table-001.html"
    "widgets/tables/cross-table-001.html"
    "widgets/tables/data-grid-001.html"
    "widgets/tables/result-enumerator-001.html"
    "widgets/tables/table-standard-001.html"
)

# Remplacements à effectuer
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Correction de $file..."
        
        # Sauvegarder l'original
        cp "$file" "$file.bak"
        
        # Remplacer les noms de champs incorrects par les bons
        sed -i '' 's/record\.fields\.date_creation/record.fields.creationdate/g' "$file"
        sed -i '' 's/record\.fields\.categorie/record.fields.category/g' "$file"
        sed -i '' 's/record\.fields\.statut/record.fields.status/g' "$file"
        sed -i '' 's/record\.fields\.ville/record.fields.dep_name/g' "$file"
        sed -i '' 's/record\.fields\.code_postal/record.fields.dep_code/g' "$file"
        sed -i '' 's/record\.fields\.departement/record.fields.dep_name/g' "$file"
        sed -i '' 's/record\.fields\.details/record.fields.subcategories/g' "$file"
        
        # Corriger les filtres
        sed -i '' 's/refine\.categorie/refine.category/g' "$file"
        sed -i '' 's/refine\.statut/refine.status/g' "$file"
        sed -i '' 's/refine\.departement/refine.dep_name/g' "$file"
        
        # Corriger les valeurs de catégories
        sed -i '' 's/>Alimentation</>AchatInternet</g' "$file"
        sed -i '' 's/>Services</>TelephonieFaiMedias</g' "$file"
        sed -i '' 's/>Commerce</>AchatMagasinInternet</g' "$file"
        sed -i '' 's/>Internet</>AchatInternet</g' "$file"
        sed -i '' 's/>Santé</>IntoxicationAlimentaire</g' "$file"
        
        # Corriger les valeurs de statuts
        sed -i '' 's/>Nouveau</>NA</g' "$file"
        sed -i '' 's/>En cours</>NonConsulte</g' "$file"
        sed -i '' 's/>Traité</>PromesseAction</g' "$file"
        sed -i '' 's/>Clos</>Infonde</g' "$file"
        
        echo "✅ $file corrigé"
    fi
done

echo ""
echo "🎯 Création d'une version vanilla pour les widgets complexes..."

# Créer des versions vanilla pour les widgets complexes qui utilisent ODS
cat > widgets/tables/advanced-table-vanilla.html << 'EOF'
<!DOCTYPE html>
<html lang="fr" data-fr-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Table Avancée DSFR - SignalConso</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.11.2/dist/dsfr.min.css">
    <style>
        body { overflow-x: hidden; }
        .table-container { overflow-x: auto; overflow-y: hidden; margin: 2rem 0; }
        .filters-panel { background: #f6f6f6; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px; }
        .status-badge { padding: 0.25rem 0.5rem; border-radius: 3px; font-size: 0.875rem; }
        .status-NA { background: #e5e5e5; color: #666; }
        .status-NonConsulte { background: #ffe9e6; color: #ce0500; }
        .status-PromesseAction { background: #d4f4dd; color: #18753c; }
        .status-Infonde { background: #fff4e6; color: #b34000; }
    </style>
</head>
<body>
    <div class="fr-container fr-py-3w">
        <h1 class="fr-h3">Table avancée avec filtres multiples</h1>
        
        <!-- Panneau de filtres avancés -->
        <div class="filters-panel">
            <h2 class="fr-h5">Filtres avancés</h2>
            <div class="fr-grid-row fr-grid-row--gutters">
                <div class="fr-col-12 fr-col-md-3">
                    <div class="fr-input-group">
                        <label class="fr-label" for="search-text">Recherche textuelle</label>
                        <input class="fr-input" type="text" id="search-text" placeholder="Rechercher...">
                    </div>
                </div>
                <div class="fr-col-12 fr-col-md-3">
                    <div class="fr-input-group">
                        <label class="fr-label" for="date-from">Date début</label>
                        <input class="fr-input" type="date" id="date-from">
                    </div>
                </div>
                <div class="fr-col-12 fr-col-md-3">
                    <div class="fr-input-group">
                        <label class="fr-label" for="date-to">Date fin</label>
                        <input class="fr-input" type="date" id="date-to">
                    </div>
                </div>
                <div class="fr-col-12 fr-col-md-3">
                    <button class="fr-btn" onclick="applyFilters()">Appliquer les filtres</button>
                    <button class="fr-btn fr-btn--secondary" onclick="resetFilters()">Réinitialiser</button>
                </div>
            </div>
            
            <div class="fr-grid-row fr-grid-row--gutters fr-mt-2w">
                <div class="fr-col-12 fr-col-md-3">
                    <fieldset class="fr-fieldset">
                        <legend class="fr-fieldset__legend">Statuts</legend>
                        <div class="fr-checkbox-group">
                            <input type="checkbox" id="status-na" value="NA">
                            <label class="fr-label" for="status-na">Non applicable</label>
                        </div>
                        <div class="fr-checkbox-group">
                            <input type="checkbox" id="status-nc" value="NonConsulte">
                            <label class="fr-label" for="status-nc">Non consulté</label>
                        </div>
                        <div class="fr-checkbox-group">
                            <input type="checkbox" id="status-pa" value="PromesseAction">
                            <label class="fr-label" for="status-pa">Promesse action</label>
                        </div>
                    </fieldset>
                </div>
                <div class="fr-col-12 fr-col-md-3">
                    <div class="fr-select-group">
                        <label class="fr-label" for="filter-region">Région</label>
                        <select class="fr-select" id="filter-region" multiple size="5">
                            <option value="Île-de-France">Île-de-France</option>
                            <option value="Provence-Alpes-Côte d'Azur">PACA</option>
                            <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
                            <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
                            <option value="Occitanie">Occitanie</option>
                        </select>
                    </div>
                </div>
                <div class="fr-col-12 fr-col-md-6">
                    <div class="fr-callout">
                        <h3 class="fr-callout__title">Statistiques filtrées</h3>
                        <p class="fr-callout__text">
                            Résultats : <strong id="filtered-count">0</strong> / <strong id="total-count">0</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Table -->
        <div class="table-container">
            <table class="fr-table fr-table--bordered">
                <thead>
                    <tr>
                        <th onclick="sortTable('creationdate')" style="cursor: pointer;">Date ↕</th>
                        <th onclick="sortTable('category')" style="cursor: pointer;">Catégorie ↕</th>
                        <th onclick="sortTable('dep_name')" style="cursor: pointer;">Département ↕</th>
                        <th>Région</th>
                        <th onclick="sortTable('status')" style="cursor: pointer;">Statut ↕</th>
                        <th>Tags</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                    <tr><td colspan="7" style="text-align: center;">Chargement...</td></tr>
                </tbody>
            </table>
        </div>
        
        <!-- Export -->
        <div class="fr-btns-group fr-mt-3w">
            <ul class="fr-btns-group__list">
                <li>
                    <button class="fr-btn fr-btn--secondary" onclick="exportFiltered()">
                        Exporter les résultats filtrés
                    </button>
                </li>
            </ul>
        </div>
    </div>
    
    <script>
        let allData = [];
        let filteredData = [];
        let currentSort = { field: 'creationdate', desc: true };
        
        async function loadData() {
            try {
                const response = await fetch('https://data.economie.gouv.fr/api/records/1.0/search/?dataset=signalconso&rows=100&sort=-creationdate');
                const data = await response.json();
                allData = data.records || [];
                document.getElementById('total-count').textContent = data.nhits;
                applyFilters();
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
        
        function applyFilters() {
            filteredData = allData.filter(record => {
                const fields = record.fields || {};
                
                // Filtre recherche textuelle
                const searchText = document.getElementById('search-text').value.toLowerCase();
                if (searchText) {
                    const text = JSON.stringify(fields).toLowerCase();
                    if (!text.includes(searchText)) return false;
                }
                
                // Filtre dates
                const dateFrom = document.getElementById('date-from').value;
                const dateTo = document.getElementById('date-to').value;
                if (dateFrom && fields.creationdate < dateFrom) return false;
                if (dateTo && fields.creationdate > dateTo) return false;
                
                // Filtre statuts
                const checkedStatuses = [];
                if (document.getElementById('status-na').checked) checkedStatuses.push('NA');
                if (document.getElementById('status-nc').checked) checkedStatuses.push('NonConsulte');
                if (document.getElementById('status-pa').checked) checkedStatuses.push('PromesseAction');
                if (checkedStatuses.length > 0 && !checkedStatuses.includes(fields.status)) return false;
                
                // Filtre régions
                const selectedRegions = Array.from(document.getElementById('filter-region').selectedOptions).map(o => o.value);
                if (selectedRegions.length > 0 && !selectedRegions.includes(fields.reg_name)) return false;
                
                return true;
            });
            
            document.getElementById('filtered-count').textContent = filteredData.length;
            displayData();
        }
        
        function displayData() {
            const tbody = document.getElementById('table-body');
            tbody.innerHTML = '';
            
            if (filteredData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Aucun résultat</td></tr>';
                return;
            }
            
            filteredData.forEach(record => {
                const fields = record.fields || {};
                const row = document.createElement('tr');
                row.innerHTML = \`
                    <td>\${fields.creationdate ? new Date(fields.creationdate).toLocaleDateString('fr-FR') : ''}</td>
                    <td><span class="fr-badge fr-badge--sm">\${fields.category || ''}</span></td>
                    <td>\${fields.dep_name || ''} (\${fields.dep_code || ''})</td>
                    <td>\${fields.reg_name || ''}</td>
                    <td><span class="status-badge status-\${fields.status}">\${fields.status || ''}</span></td>
                    <td>\${fields.tags || '-'}</td>
                    <td><button class="fr-btn fr-btn--sm" onclick="viewDetails('\${record.recordid}')">Détails</button></td>
                \`;
                tbody.appendChild(row);
            });
        }
        
        function sortTable(field) {
            if (currentSort.field === field) {
                currentSort.desc = !currentSort.desc;
            } else {
                currentSort.field = field;
                currentSort.desc = false;
            }
            
            filteredData.sort((a, b) => {
                const valA = a.fields[field] || '';
                const valB = b.fields[field] || '';
                const comparison = valA > valB ? 1 : valA < valB ? -1 : 0;
                return currentSort.desc ? -comparison : comparison;
            });
            
            displayData();
        }
        
        function resetFilters() {
            document.getElementById('search-text').value = '';
            document.getElementById('date-from').value = '';
            document.getElementById('date-to').value = '';
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.getElementById('filter-region').selectedIndex = -1;
            applyFilters();
        }
        
        function exportFiltered() {
            const csv = filteredData.map(r => {
                const f = r.fields;
                return [f.creationdate, f.category, f.dep_name, f.reg_name, f.status].join(',');
            }).join('\\n');
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'signalconso-filtered.csv';
            a.click();
        }
        
        function viewDetails(id) {
            const record = allData.find(r => r.recordid === id);
            if (record) {
                alert('Détails du signalement:\\n\\n' + JSON.stringify(record.fields, null, 2));
            }
        }
        
        loadData();
    </script>
</body>
</html>
EOF

echo "✅ advanced-table-vanilla.html créé"

echo ""
echo "🎉 Correction terminée !"
echo ""
echo "Fichiers corrigés :"
for file in "${files[@]}"; do
    echo "  - $file"
done
echo ""
echo "Nouveau fichier créé :"
echo "  - widgets/tables/advanced-table-vanilla.html"
echo ""
echo "Pour restaurer les originaux : renommez les fichiers .bak"