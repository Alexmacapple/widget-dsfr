// Données de démonstration pour widgets DSFR
// Utilisé en fallback quand l'API data.economie.gouv.fr est indisponible

const DemoDataGenerator = {
  // Génère des données SignalConso
  signalconso: function(count = 50) {
    const categories = ['AchatInternet', 'TelephonieFaiMedias', 'VoyageLoisirs', 'BanqueAssuranceMutuelle', 'Immobilier'];
    const statuses = ['NA', 'NonConsulte', 'PromesseAction', 'Infonde'];
    const departments = [
      { code: '75', name: 'Paris' },
      { code: '69', name: 'Rhône' },
      { code: '13', name: 'Bouches-du-Rhône' },
      { code: '33', name: 'Gironde' },
      { code: '59', name: 'Nord' },
      { code: '06', name: 'Alpes-Maritimes' },
      { code: '31', name: 'Haute-Garonne' },
      { code: '44', name: 'Loire-Atlantique' }
    ];
    const regions = [
      'Île-de-France', 
      'Auvergne-Rhône-Alpes', 
      'Provence-Alpes-Côte d\'Azur', 
      'Nouvelle-Aquitaine', 
      'Hauts-de-France',
      'Occitanie',
      'Pays de la Loire'
    ];
        
    const data = [];
    for (let i = 0; i < count; i++) {
      const dept = departments[Math.floor(Math.random() * departments.length)];
      data.push({
        recordid: `demo_${Date.now()}_${i}`,
        fields: {
          creationdate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          category: categories[Math.floor(Math.random() * categories.length)],
          subcategories: `Sous-catégorie ${i % 5 + 1}`,
          dep_code: dept.code,
          dep_name: dept.name,
          reg_name: regions[Math.floor(Math.random() * regions.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          companyname: `Entreprise ${Math.floor(Math.random() * 100)}`,
          problemdescription: `Description du problème signalé numéro ${i + 1}`,
          consumerpostalcode: dept.code + Math.floor(Math.random() * 900 + 100)
        }
      });
    }
    return data;
  },
    
  // Génère des données génériques
  generic: function(count = 30) {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        recordid: `generic_${Date.now()}_${i}`,
        fields: {
          id: i + 1,
          name: `Élément ${i + 1}`,
          value: Math.floor(Math.random() * 1000),
          category: `Catégorie ${Math.floor(i / 10) + 1}`,
          date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: Math.random() > 0.5 ? 'Actif' : 'Inactif',
          description: `Description détaillée de l'élément numéro ${i + 1}`
        }
      });
    }
    return data;
  },
    
  // Wrapper pour compatibilité avec widgets existants
  generateDemoData: function(type = 'signalconso', count = 50) {
    if (this[type]) {
      return this[type](count);
    }
    return this.generic(count);
  }
};

// Export pour utilisation dans les widgets
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DemoDataGenerator;
}