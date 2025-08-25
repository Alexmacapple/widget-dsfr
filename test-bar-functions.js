// Script de test pour vérifier les fonctions du graphique en barres

// Test 1: Vérifier que les variables originales sont sauvegardées
function testOriginalDataSaved() {
  console.log('Test 1: Variables originales sauvegardées');
  if (typeof originalLabels !== 'undefined' && typeof originalValues !== 'undefined') {
    console.log('✅ originalLabels et originalValues existent');
    console.log('originalLabels:', originalLabels);
    console.log('originalValues:', originalValues);
  } else {
    console.log('❌ Variables originales non trouvées');
  }
}

// Test 2: Vérifier le changement de type de graphique
function testChartTypeChange() {
  console.log('\nTest 2: Changement de type de graphique');
    
  // Test barres horizontales
  document.getElementById('chart-type').value = 'horizontalBar';
  changeChartType();
    
  if (config.options.indexAxis === 'y') {
    console.log('✅ Barres horizontales: indexAxis = \'y\'');
  } else {
    console.log('❌ Barres horizontales: indexAxis incorrect =', config.options.indexAxis);
  }
    
  // Test barres verticales
  document.getElementById('chart-type').value = 'bar';
  changeChartType();
    
  if (config.options.indexAxis === 'x') {
    console.log('✅ Barres verticales: indexAxis = \'x\'');
  } else {
    console.log('❌ Barres verticales: indexAxis incorrect =', config.options.indexAxis);
  }
}

// Test 3: Vérifier le tri des données
function testDataSorting() {
  console.log('\nTest 3: Tri des données');
    
  // Sauvegarder l'état initial
  const initialLabels = [...chartLabels];
  const initialValues = [...chartValues];
    
  // Test tri alphabétique
  document.getElementById('sort-select').value = 'alpha';
  sortData();
    
  let isAlphaSorted = true;
  for (let i = 1; i < chartLabels.length; i++) {
    if (chartLabels[i].localeCompare(chartLabels[i-1], 'fr') < 0) {
      isAlphaSorted = false;
      break;
    }
  }
    
  if (isAlphaSorted) {
    console.log('✅ Tri alphabétique fonctionne');
  } else {
    console.log('❌ Tri alphabétique ne fonctionne pas');
    console.log('Labels après tri alpha:', chartLabels);
  }
    
  // Test tri croissant
  document.getElementById('sort-select').value = 'asc';
  sortData();
    
  let isAscSorted = true;
  for (let i = 1; i < chartValues.length; i++) {
    if (chartValues[i] < chartValues[i-1]) {
      isAscSorted = false;
      break;
    }
  }
    
  if (isAscSorted) {
    console.log('✅ Tri croissant fonctionne');
  } else {
    console.log('❌ Tri croissant ne fonctionne pas');
    console.log('Values après tri asc:', chartValues);
  }
    
  // Test tri décroissant
  document.getElementById('sort-select').value = 'desc';
  sortData();
    
  let isDescSorted = true;
  for (let i = 1; i < chartValues.length; i++) {
    if (chartValues[i] > chartValues[i-1]) {
      isDescSorted = false;
      break;
    }
  }
    
  if (isDescSorted) {
    console.log('✅ Tri décroissant fonctionne');
  } else {
    console.log('❌ Tri décroissant ne fonctionne pas');
    console.log('Values après tri desc:', chartValues);
  }
}

// Lancer tous les tests
function runAllTests() {
  console.log('=== DÉBUT DES TESTS ===');
    
  // Attendre que les données soient chargées
  setTimeout(() => {
    testOriginalDataSaved();
    testChartTypeChange();
    testDataSorting();
    console.log('\n=== FIN DES TESTS ===');
  }, 2000);
}

// Exécuter les tests au chargement
if (typeof window !== 'undefined') {
  window.addEventListener('load', runAllTests);
}

console.log('Script de test chargé. Les tests seront exécutés dans 2 secondes...');