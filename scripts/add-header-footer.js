#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Template du header DSFR
const getHeader = (title, description) => `
    <!-- Header DSFR -->
    <header role="banner" class="fr-header">
        <div class="fr-header__body">
            <div class="fr-container">
                <div class="fr-header__body-row">
                    <div class="fr-header__brand fr-enlarge-link">
                        <div class="fr-header__brand-top">
                            <div class="fr-header__logo">
                                <p class="fr-logo">
                                    République
                                    <br>Française
                                </p>
                            </div>
                        </div>
                        <div class="fr-header__service">
                            <a href="/" title="Accueil - SignalConso">
                                <p class="fr-header__service-title">
                                    SignalConso
                                </p>
                            </a>
                            <p class="fr-header__service-tagline">${description} - data.economie.gouv.fr</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
`;

// Template du footer DSFR
const getFooter = (description) => `
    <!-- Footer DSFR -->
    <footer class="fr-footer" role="contentinfo" id="fr-footer">
        <div class="fr-container">
            <div class="fr-footer__body">
                <div class="fr-footer__brand fr-enlarge-link">
                    <a href="/" title="Retour à l'accueil">
                        <p class="fr-logo">
                            République
                            <br>Française
                        </p>
                    </a>
                </div>
                <div class="fr-footer__content">
                    <p class="fr-footer__content-desc">
                        ${description}. Données issues de data.economie.gouv.fr
                    </p>
                    <ul class="fr-footer__content-list">
                        <li class="fr-footer__content-item">
                            <a class="fr-footer__content-link" target="_blank" href="https://data.economie.gouv.fr" rel="noopener external">data.economie.gouv.fr</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="fr-footer__bottom">
                <ul class="fr-footer__bottom-list">
                    <li class="fr-footer__bottom-item">
                        <a class="fr-footer__bottom-link" href="#">Accessibilité : conforme</a>
                    </li>
                    <li class="fr-footer__bottom-item">
                        <a class="fr-footer__bottom-link" href="#">Mentions légales</a>
                    </li>
                    <li class="fr-footer__bottom-item">
                        <a class="fr-footer__bottom-link" href="#">Données personnelles</a>
                    </li>
                </ul>
                <div class="fr-footer__bottom-copy">
                    <p>
                        Sauf mention contraire, tous les contenus de ce site sont sous
                        <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank" rel="noopener external">licence etalab-2.0</a>
                    </p>
                </div>
            </div>
        </div>
    </footer>
`;

// Template pour les liens d'évitement (accessibilité)
const skipLinks = `
    <!-- Skip links pour l'accessibilité -->
    <div class="fr-skiplinks">
        <nav class="fr-container" role="navigation" aria-label="Accès rapide">
            <ul class="fr-skiplinks__list">
                <li><a class="fr-link" href="#content">Aller au contenu</a></li>
                <li><a class="fr-link" href="#fr-footer">Aller au pied de page</a></li>
            </ul>
        </nav>
    </div>
`;

// Fonction pour extraire le titre depuis le HTML
function extractTitle(html) {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].replace(' - SignalConso', '').trim();
  }
  return 'Widget SignalConso';
}

// Fonction pour générer une description basée sur le nom du fichier
function generateDescription(filename, title) {
  const name = path.basename(filename, '.html');
    
  // Mapping des types de widgets
  const descriptions = {
    'table': 'Tableau de données',
    'chart': 'Graphique de visualisation',
    'map': 'Carte interactive',
    'form': 'Formulaire de saisie',
    'facets': 'Filtres de recherche',
    'bar': 'Graphique en barres',
    'line': 'Graphique linéaire',
    'pie': 'Graphique en secteurs',
    'scatter': 'Nuage de points',
    'sankey': 'Diagramme de Sankey',
    'treemap': 'Carte proportionnelle',
    'donut': 'Graphique en anneau',
    'heatmap': 'Carte de chaleur',
    'calendar': 'Calendrier',
    'radar': 'Graphique radar',
    'combo': 'Graphique combiné',
    'area': 'Graphique en aires'
  };
    
  // Chercher le type dans le nom du fichier
  for (const [key, desc] of Object.entries(descriptions)) {
    if (name.toLowerCase().includes(key)) {
      return desc + ' SignalConso';
    }
  }
    
  return title || 'Widget SignalConso';
}

// Fonction pour ajouter header et footer à un fichier HTML
function processHTMLFile(filepath) {
  console.log(`Processing: ${filepath}`);
    
  let html = fs.readFileSync(filepath, 'utf8');
    
  // Vérifier si le fichier a déjà un header/footer DSFR
  if (html.includes('fr-header') && html.includes('fr-footer')) {
    console.log('  ✓ Already has header/footer, skipping');
    return false;
  }
    
  // Extraire le titre et générer la description
  const title = extractTitle(html);
  const description = generateDescription(filepath, title);
    
  // Chercher le body
  const bodyMatch = html.match(/<body[^>]*>/i);
  if (!bodyMatch) {
    console.log('  ✗ No body tag found, skipping');
    return false;
  }
    
  const bodyTag = bodyMatch[0];
  const bodyIndex = html.indexOf(bodyTag) + bodyTag.length;
    
  // Chercher la fin du body
  const bodyEndIndex = html.lastIndexOf('</body>');
  if (bodyEndIndex === -1) {
    console.log('  ✗ No closing body tag found, skipping');
    return false;
  }
    
  // Extraire le contenu actuel du body
  let bodyContent = html.substring(bodyIndex, bodyEndIndex).trim();
    
  // Vérifier si le contenu est déjà dans un main
  const hasMain = bodyContent.includes('<main');
    
  // Si pas de main, entourer le contenu
  if (!hasMain) {
    // Nettoyer les commentaires de début/fin si présents
    bodyContent = bodyContent
      .replace(/^\s*<!--.*?-->\s*/s, '')
      .replace(/\s*<!--.*?-->\s*$/s, '');
        
    bodyContent = `
    <!-- Main content -->
    <main id="content" role="main">
        <div class="fr-container fr-py-6w">
            ${bodyContent}
        </div>
    </main>`;
  }
    
  // Construire le nouveau HTML
  const newBody = `
${skipLinks}
${getHeader(title, description)}
${bodyContent}
${getFooter(description)}
`;
    
  // Remplacer le contenu du body
  const newHtml = html.substring(0, bodyIndex) + newBody + html.substring(bodyEndIndex);
    
  // Écrire le fichier
  fs.writeFileSync(filepath, newHtml, 'utf8');
  console.log('  ✓ Added header and footer');
    
  return true;
}

// Fonction pour traiter un dossier
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let processed = 0;
  let skipped = 0;
    
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const filepath = path.join(dirPath, file);
      if (processHTMLFile(filepath)) {
        processed++;
      } else {
        skipped++;
      }
    }
  });
    
  return { processed, skipped };
}

// Main
function main() {
  console.log('Adding DSFR header/footer to all widgets...\n');
    
  const widgetDirs = [
    'widgets/charts',
    'widgets/maps',
    'widgets/tables',
    'widgets/forms',
    'widgets/facets'
  ];
    
  let totalProcessed = 0;
  let totalSkipped = 0;
    
  widgetDirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(fullPath)) {
      console.log(`\nProcessing ${dir}...`);
      const { processed, skipped } = processDirectory(fullPath);
      totalProcessed += processed;
      totalSkipped += skipped;
      console.log(`  Summary: ${processed} processed, ${skipped} skipped`);
    } else {
      console.log(`\n✗ Directory not found: ${dir}`);
    }
  });
    
  console.log('\n' + '='.repeat(50));
  console.log(`Total: ${totalProcessed} files processed, ${totalSkipped} files skipped`);
  console.log('Done!');
}

// Exécuter
if (require.main === module) {
  main();
}