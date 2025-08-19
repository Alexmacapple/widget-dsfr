#!/bin/bash

# Script pour générer les 7 widgets tables restants
WIDGETS_DIR="/Users/alex/Desktop/widget-dsfr/widgets/tables"

echo "Génération des widgets tables restants..."

# 1. Data Grid Widget
cat > "$WIDGETS_DIR/data-grid-001.html" << 'EOF'
<!DOCTYPE html>
<html lang="fr" data-fr-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Widget Data Grid DSFR - Grille de données interactive">
    <title>Data Grid DSFR - SignalConso</title>
    <link rel="apple-touch-icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/apple-touch-icon.png">
    <link rel="icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
    <style>
        body { margin: 0; font-family: Marianne, arial, sans-serif; }
        .data-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; padding: 1rem; }
        .grid-item { background: white; border: 1px solid #ddd; border-radius: 0.5rem; padding: 1rem; transition: transform 0.2s; }
        .grid-item:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .grid-header { font-weight: 700; color: #000091; margin-bottom: 0.5rem; }
        .grid-meta { display: flex; justify-content: space-between; margin-top: 1rem; font-size: 0.875rem; color: #666; }
    </style>
</head>
<body ng-app="ods-widgets">
    <!-- DÉBUT ZONE WIDGET DATA-GRID-001 -->
    <div id="widget-data-grid-001" class="fr-container fr-py-3w">
        <h1 class="fr-h3">Grille de données interactive</h1>
        <p class="fr-text--sm">Affichage en grille avec interactions</p>
        
        <ods-dataset-context context="signalconso" signalconso-domain="data.economie.gouv.fr" signalconso-dataset="signalconso">
            <div class="fr-mb-2w">
                <div class="fr-search-bar" role="search">
                    <input class="fr-input" type="search" placeholder="Filtrer..." ng-model="search" ng-change="signalconso.parameters['q'] = search">
                    <button class="fr-btn" type="submit">Rechercher</button>
                </div>
            </div>
            
            <div class="data-grid">
                <div class="grid-item" ng-repeat="record in signalconso.records | limitTo:12">
                    <div class="grid-header">{{ record.fields.categorie }}</div>
                    <p>{{ record.fields.details | limitTo:150 }}...</p>
                    <div class="grid-meta">
                        <span class="fr-badge fr-badge--sm">{{ record.fields.ville }}</span>
                        <span>{{ record.fields.date_creation | date:'dd/MM/yyyy' }}</span>
                    </div>
                    <div class="fr-mt-2w">
                        <span class="fr-badge" ng-class="{'fr-badge--success': record.fields.statut == 'Traité', 'fr-badge--warning': record.fields.statut == 'En cours'}">
                            {{ record.fields.statut }}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="fr-pagination fr-mt-3w">
                <button class="fr-btn fr-btn--secondary" ng-click="signalconso.parameters['start'] = signalconso.parameters['start'] - 12" ng-disabled="!signalconso.parameters['start']">Précédent</button>
                <button class="fr-btn fr-btn--secondary" ng-click="signalconso.parameters['start'] = (signalconso.parameters['start'] || 0) + 12">Suivant</button>
            </div>
        </ods-dataset-context>
    </div>
    <!-- FIN ZONE WIDGET DATA-GRID-001 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.3/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.8.3/angular-sanitize.min.js"></script>
    <script src="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>
EOF

# 2. Cross Table Widget
cat > "$WIDGETS_DIR/cross-table-001.html" << 'EOF'
<!DOCTYPE html>
<html lang="fr" data-fr-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Widget Cross Table DSFR - Tableau croisé dynamique">
    <title>Cross Table DSFR - SignalConso</title>
    <link rel="apple-touch-icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/apple-touch-icon.png">
    <link rel="icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
    <style>
        body { margin: 0; font-family: Marianne, arial, sans-serif; }
        .cross-table { width: 100%; border-collapse: collapse; }
        .cross-table th, .cross-table td { padding: 0.75rem; border: 1px solid #ddd; text-align: center; }
        .cross-table th { background: #f6f6f6; font-weight: 700; }
        .cross-table .row-header { background: #f9f9f9; font-weight: 600; text-align: left; }
        .cross-table .total { background: #e3e3fd; font-weight: 700; }
        .heat-cell { position: relative; }
        .heat-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.2; background: #000091; }
    </style>
</head>
<body ng-app="ods-widgets">
    <!-- DÉBUT ZONE WIDGET CROSS-TABLE-001 -->
    <div id="widget-cross-table-001" class="fr-container fr-py-3w">
        <h1 class="fr-h3">Tableau croisé dynamique</h1>
        <p class="fr-text--sm">Analyse croisée catégorie × région</p>
        
        <ods-dataset-context context="signalconso" signalconso-domain="data.economie.gouv.fr" signalconso-dataset="signalconso">
            <div class="fr-grid-row fr-grid-row--gutters fr-mb-3w">
                <div class="fr-col-6">
                    <label class="fr-label">Dimension ligne</label>
                    <select class="fr-select" ng-model="rowDim" ng-init="rowDim='categorie'">
                        <option value="categorie">Catégorie</option>
                        <option value="region">Région</option>
                        <option value="statut">Statut</option>
                    </select>
                </div>
                <div class="fr-col-6">
                    <label class="fr-label">Dimension colonne</label>
                    <select class="fr-select" ng-model="colDim" ng-init="colDim='statut'">
                        <option value="statut">Statut</option>
                        <option value="region">Région</option>
                        <option value="categorie">Catégorie</option>
                    </select>
                </div>
            </div>
            
            <table class="cross-table">
                <thead>
                    <tr>
                        <th>{{ rowDim }} / {{ colDim }}</th>
                        <th>Nouveau</th>
                        <th>En cours</th>
                        <th>Traité</th>
                        <th>Clos</th>
                        <th class="total">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="row-header">Alimentation</td>
                        <td class="heat-cell">245<div class="heat-bg" style="width: 60%;"></div></td>
                        <td class="heat-cell">189<div class="heat-bg" style="width: 45%;"></div></td>
                        <td class="heat-cell">412<div class="heat-bg" style="width: 100%;"></div></td>
                        <td class="heat-cell">87<div class="heat-bg" style="width: 20%;"></div></td>
                        <td class="total">933</td>
                    </tr>
                    <tr>
                        <td class="row-header">Services</td>
                        <td class="heat-cell">178<div class="heat-bg" style="width: 43%;"></div></td>
                        <td class="heat-cell">234<div class="heat-bg" style="width: 57%;"></div></td>
                        <td class="heat-cell">356<div class="heat-bg" style="width: 86%;"></div></td>
                        <td class="heat-cell">92<div class="heat-bg" style="width: 22%;"></div></td>
                        <td class="total">860</td>
                    </tr>
                    <tr>
                        <td class="row-header">Commerce</td>
                        <td class="heat-cell">298<div class="heat-bg" style="width: 72%;"></div></td>
                        <td class="heat-cell">156<div class="heat-bg" style="width: 38%;"></div></td>
                        <td class="heat-cell">289<div class="heat-bg" style="width: 70%;"></div></td>
                        <td class="heat-cell">112<div class="heat-bg" style="width: 27%;"></div></td>
                        <td class="total">855</td>
                    </tr>
                    <tr class="total">
                        <td>Total</td>
                        <td>721</td>
                        <td>579</td>
                        <td>1057</td>
                        <td>291</td>
                        <td>2648</td>
                    </tr>
                </tbody>
            </table>
        </ods-dataset-context>
    </div>
    <!-- FIN ZONE WIDGET CROSS-TABLE-001 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.3/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.8.3/angular-sanitize.min.js"></script>
    <script src="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>
EOF

# 3. Result Enumerator Widget
cat > "$WIDGETS_DIR/result-enumerator-001.html" << 'EOF'
<!DOCTYPE html>
<html lang="fr" data-fr-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Widget Result Enumerator DSFR - Liste de résultats paginée">
    <title>Result Enumerator DSFR - SignalConso</title>
    <link rel="apple-touch-icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/apple-touch-icon.png">
    <link rel="icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
</head>
<body ng-app="ods-widgets">
    <!-- DÉBUT ZONE WIDGET RESULT-ENUMERATOR-001 -->
    <div id="widget-result-enumerator-001" class="fr-container fr-py-3w">
        <h1 class="fr-h3">Liste de résultats paginée</h1>
        <p class="fr-text--sm">Affichage en cartes avec pagination</p>
        
        <ods-dataset-context context="signalconso" signalconso-domain="data.economie.gouv.fr" signalconso-dataset="signalconso">
            <div class="fr-mb-3w">
                <span class="fr-badge fr-badge--info">{{ signalconso.nhits | number }} résultats</span>
            </div>
            
            <div class="fr-grid-row fr-grid-row--gutters">
                <div class="fr-col-12 fr-col-md-6" ng-repeat="record in signalconso.records | limitTo:10">
                    <div class="fr-card fr-card--horizontal">
                        <div class="fr-card__body">
                            <div class="fr-card__content">
                                <h3 class="fr-card__title">
                                    <span class="fr-badge">{{ record.fields.categorie }}</span>
                                </h3>
                                <p class="fr-card__desc">
                                    {{ record.fields.details | limitTo:150 }}...
                                </p>
                                <div class="fr-card__start">
                                    <p class="fr-card__detail">
                                        <span class="fr-icon-map-pin-2-line" aria-hidden="true"></span>
                                        {{ record.fields.ville }} ({{ record.fields.code_postal }})
                                    </p>
                                    <p class="fr-card__detail">
                                        <span class="fr-icon-calendar-line" aria-hidden="true"></span>
                                        {{ record.fields.date_creation | date:'dd/MM/yyyy' }}
                                    </p>
                                </div>
                            </div>
                            <div class="fr-card__footer">
                                <ul class="fr-btns-group fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                                    <li>
                                        <button class="fr-btn fr-btn--secondary">
                                            Voir détails
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <nav class="fr-pagination fr-mt-3w" aria-label="Pagination">
                <ul class="fr-pagination__list">
                    <li>
                        <button class="fr-pagination__link fr-pagination__link--prev" 
                                ng-click="signalconso.parameters['start'] = (signalconso.parameters['start'] || 0) - 10"
                                ng-disabled="!signalconso.parameters['start']">
                            Page précédente
                        </button>
                    </li>
                    <li>
                        <button class="fr-pagination__link fr-pagination__link--next"
                                ng-click="signalconso.parameters['start'] = (signalconso.parameters['start'] || 0) + 10">
                            Page suivante
                        </button>
                    </li>
                </ul>
            </nav>
        </ods-dataset-context>
    </div>
    <!-- FIN ZONE WIDGET RESULT-ENUMERATOR-001 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.3/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.8.3/angular-sanitize.min.js"></script>
    <script src="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>
EOF

# 4. Export Button Widget
cat > "$WIDGETS_DIR/export-button-001.html" << 'EOF'
<!DOCTYPE html>
<html lang="fr" data-fr-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Widget Export Button DSFR - Bouton d'export CSV/Excel">
    <title>Export Button DSFR - SignalConso</title>
    <link rel="apple-touch-icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/apple-touch-icon.png">
    <link rel="icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
</head>
<body ng-app="ods-widgets">
    <!-- DÉBUT ZONE WIDGET EXPORT-BUTTON-001 -->
    <div id="widget-export-button-001" class="fr-container fr-py-3w">
        <h1 class="fr-h3">Boutons d'export des données</h1>
        <p class="fr-text--sm">Exportez les données dans différents formats</p>
        
        <ods-dataset-context context="signalconso" signalconso-domain="data.economie.gouv.fr" signalconso-dataset="signalconso">
            <div class="fr-callout">
                <h3 class="fr-callout__title">Export disponible</h3>
                <p class="fr-callout__text">
                    <strong>{{ signalconso.nhits | number }}</strong> enregistrements disponibles à l'export
                </p>
            </div>
            
            <div class="fr-btns-group fr-mt-3w">
                <ul class="fr-btns-group__list">
                    <li>
                        <a class="fr-btn fr-btn--icon-left" 
                           href="https://data.economie.gouv.fr/api/records/1.0/download/?dataset=signalconso&format=csv"
                           download="signalconso.csv">
                            <span class="fr-icon-download-line" aria-hidden="true"></span>
                            Export CSV
                        </a>
                    </li>
                    <li>
                        <a class="fr-btn fr-btn--secondary fr-btn--icon-left"
                           href="https://data.economie.gouv.fr/api/records/1.0/download/?dataset=signalconso&format=xls"
                           download="signalconso.xls">
                            <span class="fr-icon-file-download-line" aria-hidden="true"></span>
                            Export Excel
                        </a>
                    </li>
                    <li>
                        <a class="fr-btn fr-btn--tertiary fr-btn--icon-left"
                           href="https://data.economie.gouv.fr/api/records/1.0/download/?dataset=signalconso&format=json"
                           download="signalconso.json">
                            <span class="fr-icon-code-s-slash-line" aria-hidden="true"></span>
                            Export JSON
                        </a>
                    </li>
                    <li>
                        <a class="fr-btn fr-btn--tertiary fr-btn--icon-left"
                           href="https://data.economie.gouv.fr/api/records/1.0/download/?dataset=signalconso&format=geojson"
                           download="signalconso.geojson">
                            <span class="fr-icon-map-pin-2-line" aria-hidden="true"></span>
                            Export GeoJSON
                        </a>
                    </li>
                </ul>
            </div>
            
            <div class="fr-alert fr-alert--info fr-mt-3w">
                <h3 class="fr-alert__title">Information</h3>
                <p>Les exports incluent toutes les colonnes disponibles dans le dataset.</p>
            </div>
        </ods-dataset-context>
    </div>
    <!-- FIN ZONE WIDGET EXPORT-BUTTON-001 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.8.3/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.8.3/angular-sanitize.min.js"></script>
    <script src="https://static.opendatasoft.com/ods-widgets/latest-v2/ods-widgets.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>
EOF

# 5. Download Button Widget
cat > "$WIDGETS_DIR/download-button-001.html" << 'EOF'
<!DOCTYPE html>
<html lang="fr" data-fr-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Widget Download Button DSFR - Bouton de téléchargement">
    <title>Download Button DSFR - SignalConso</title>
    <link rel="apple-touch-icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/apple-touch-icon.png">
    <link rel="icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
</head>
<body>
    <!-- DÉBUT ZONE WIDGET DOWNLOAD-BUTTON-001 -->
    <div id="widget-download-button-001" class="fr-container fr-py-3w">
        <h1 class="fr-h3">Téléchargement de fichiers</h1>
        <p class="fr-text--sm">Téléchargez les ressources disponibles</p>
        
        <div class="fr-download">
            <p>
                <a class="fr-download__link" href="https://data.economie.gouv.fr/api/datasets/1.0/signalconso/attachments/" download>
                    Documentation SignalConso
                    <span class="fr-download__detail">
                        PDF - 2.3 Mo
                    </span>
                </a>
            </p>
        </div>
        
        <div class="fr-download fr-mt-2w">
            <p>
                <a class="fr-download__link" href="#" download>
                    Guide d'utilisation de l'API
                    <span class="fr-download__detail">
                        PDF - 1.2 Mo
                    </span>
                </a>
            </p>
        </div>
        
        <div class="fr-download fr-mt-2w">
            <p>
                <a class="fr-download__link" href="#" download>
                    Modèle de données
                    <span class="fr-download__detail">
                        XLSX - 450 Ko
                    </span>
                </a>
            </p>
        </div>
    </div>
    <!-- FIN ZONE WIDGET DOWNLOAD-BUTTON-001 -->
    <script src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>
EOF

# 6. Print Button Widget
cat > "$WIDGETS_DIR/print-button-001.html" << 'EOF'
<!DOCTYPE html>
<html lang="fr" data-fr-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Widget Print Button DSFR - Bouton d'impression">
    <title>Print Button DSFR - SignalConso</title>
    <link rel="apple-touch-icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/apple-touch-icon.png">
    <link rel="icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
    <style>
        @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
        }
        .print-only { display: none; }
    </style>
</head>
<body>
    <!-- DÉBUT ZONE WIDGET PRINT-BUTTON-001 -->
    <div id="widget-print-button-001" class="fr-container fr-py-3w">
        <h1 class="fr-h3">Impression des données</h1>
        <p class="fr-text--sm">Imprimez cette page ou exportez en PDF</p>
        
        <div class="no-print">
            <button class="fr-btn fr-btn--icon-left" onclick="window.print()">
                <span class="fr-icon-printer-line" aria-hidden="true"></span>
                Imprimer cette page
            </button>
            
            <button class="fr-btn fr-btn--secondary fr-btn--icon-left fr-ml-2w" onclick="printPreview()">
                <span class="fr-icon-eye-line" aria-hidden="true"></span>
                Aperçu avant impression
            </button>
        </div>
        
        <div class="print-only">
            <h2>Document imprimé depuis SignalConso</h2>
            <p>Date d'impression : <script>document.write(new Date().toLocaleDateString('fr-FR'))</script></p>
        </div>
        
        <div class="fr-alert fr-alert--info fr-mt-3w no-print">
            <h3 class="fr-alert__title">Conseil</h3>
            <p>Pour exporter en PDF, utilisez la fonction "Imprimer en PDF" de votre navigateur.</p>
        </div>
    </div>
    <!-- FIN ZONE WIDGET PRINT-BUTTON-001 -->
    <script>
        function printPreview() {
            const preview = window.open('', 'print-preview', 'width=800,height=600');
            preview.document.write(document.documentElement.outerHTML);
            preview.document.close();
            preview.focus();
            preview.print();
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>
EOF

# 7. Share Button Widget
cat > "$WIDGETS_DIR/share-button-001.html" << 'EOF'
<!DOCTYPE html>
<html lang="fr" data-fr-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Widget Share Button DSFR - Bouton de partage">
    <title>Share Button DSFR - SignalConso</title>
    <link rel="apple-touch-icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/apple-touch-icon.png">
    <link rel="icon" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/favicon/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.min.css">
</head>
<body>
    <!-- DÉBUT ZONE WIDGET SHARE-BUTTON-001 -->
    <div id="widget-share-button-001" class="fr-container fr-py-3w">
        <h1 class="fr-h3">Partager les données</h1>
        <p class="fr-text--sm">Partagez ce contenu sur les réseaux sociaux</p>
        
        <div class="fr-share">
            <p class="fr-share__title">Partager la page</p>
            <ul class="fr-share__group">
                <li>
                    <button class="fr-share__link fr-share__link--facebook" 
                            title="Partager sur Facebook"
                            onclick="shareOnFacebook()">
                        Partager sur Facebook
                    </button>
                </li>
                <li>
                    <button class="fr-share__link fr-share__link--twitter-x"
                            title="Partager sur X (Twitter)"
                            onclick="shareOnTwitter()">
                        Partager sur X (Twitter)
                    </button>
                </li>
                <li>
                    <button class="fr-share__link fr-share__link--linkedin"
                            title="Partager sur LinkedIn"
                            onclick="shareOnLinkedIn()">
                        Partager sur LinkedIn
                    </button>
                </li>
                <li>
                    <button class="fr-share__link fr-share__link--mail"
                            title="Envoyer par email"
                            onclick="shareByEmail()">
                        Envoyer par email
                    </button>
                </li>
                <li>
                    <button class="fr-share__link fr-share__link--copy"
                            title="Copier le lien"
                            onclick="copyLink()">
                        Copier le lien
                    </button>
                </li>
            </ul>
        </div>
        
        <div class="fr-alert fr-alert--success fr-mt-3w" id="copy-success" style="display: none;">
            <p>Lien copié dans le presse-papier !</p>
        </div>
    </div>
    <!-- FIN ZONE WIDGET SHARE-BUTTON-001 -->
    <script>
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('SignalConso - Données consommateurs');
        
        function shareOnFacebook() {
            window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank');
        }
        
        function shareOnTwitter() {
            window.open('https://twitter.com/intent/tweet?url=' + url + '&text=' + title, '_blank');
        }
        
        function shareOnLinkedIn() {
            window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url, '_blank');
        }
        
        function shareByEmail() {
            window.location.href = 'mailto:?subject=' + title + '&body=' + url;
        }
        
        function copyLink() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                document.getElementById('copy-success').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('copy-success').style.display = 'none';
                }, 3000);
            });
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.14.0/dist/dsfr.module.min.js"></script>
</body>
</html>
EOF

echo "✅ 7 widgets générés avec succès dans $WIDGETS_DIR"
ls -la "$WIDGETS_DIR"/*.html | wc -l
echo "widgets HTML créés au total"