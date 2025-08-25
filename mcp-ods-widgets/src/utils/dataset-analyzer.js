/**
 * Analyseur de datasets OpenDataSoft
 */

export class DatasetAnalyzer {
  constructor() {
    this.apiBase = 'https://data.economie.gouv.fr/api/records/1.0';
  }

  async analyze(datasetId, domain = 'data.economie.gouv.fr') {
    try {
      // Récupérer les métadonnées du dataset
      const metadata = await this.fetchDatasetMetadata(datasetId, domain);
      
      // Analyser les champs
      const fieldAnalysis = this.analyzeFields(metadata.fields);
      
      // Récupérer un échantillon de données
      const sample = await this.fetchSampleData(datasetId, domain);
      
      // Analyser les données
      const dataAnalysis = this.analyzeData(sample.records, metadata.fields);
      
      return {
        dataset: datasetId,
        title: metadata.metas?.title || datasetId,
        description: metadata.metas?.description || '',
        recordsCount: sample.nhits || 0,
        fields: fieldAnalysis,
        dataTypes: dataAnalysis.dataTypes,
        recommendations: this.generateRecommendations(fieldAnalysis, dataAnalysis),
        facets: this.identifyFacets(fieldAnalysis, dataAnalysis),
        geoEnabled: fieldAnalysis.geoFields.length > 0,
        timeEnabled: fieldAnalysis.dateFields.length > 0,
        metadata: metadata.metas || {}
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse du dataset:', error);
      return this.getDefaultAnalysis(datasetId);
    }
  }

  async fetchDatasetMetadata(datasetId, domain) {
    // Simulation - en production, faire un appel API réel
    const datasets = {
      'signalconso': {
        fields: [
          { name: 'nom_etablissement', type: 'text', label: 'Nom établissement' },
          { name: 'categorie', type: 'text', label: 'Catégorie' },
          { name: 'sous_categorie', type: 'text', label: 'Sous-catégorie' },
          { name: 'date_creation', type: 'date', label: 'Date création' },
          { name: 'ville', type: 'text', label: 'Ville' },
          { name: 'dep', type: 'text', label: 'Département' },
          { name: 'region', type: 'text', label: 'Région' },
          { name: 'latitude', type: 'double', label: 'Latitude' },
          { name: 'longitude', type: 'double', label: 'Longitude' },
          { name: 'statut_promesse', type: 'text', label: 'Statut' }
        ],
        metas: {
          title: 'SignalConso - Signalements consommateurs',
          description: 'Base de données des signalements de consommateurs'
        }
      },
      'plf25-budget-vert': {
        fields: [
          { name: 'mission', type: 'text', label: 'Mission' },
          { name: 'programme', type: 'text', label: 'Programme' },
          { name: 'action', type: 'text', label: 'Action' },
          { name: 'montant_ae', type: 'double', label: 'Montant AE' },
          { name: 'montant_cp', type: 'double', label: 'Montant CP' },
          { name: 'classification', type: 'text', label: 'Classification' },
          { name: 'annee', type: 'int', label: 'Année' }
        ],
        metas: {
          title: 'PLF 2025 - Budget Vert',
          description: 'Budget vert du projet de loi de finances 2025'
        }
      }
    };

    return datasets[datasetId] || this.getDefaultMetadata(datasetId);
  }

  async fetchSampleData(datasetId, domain) {
    // Simulation - en production, faire un appel API réel
    return {
      nhits: 1000,
      records: []
    };
  }

  analyzeFields(fields) {
    const analysis = {
      totalFields: fields.length,
      textFields: [],
      numberFields: [],
      dateFields: [],
      geoFields: [],
      categoryFields: [],
      allFields: fields
    };

    fields.forEach(field => {
      switch (field.type) {
      case 'text':
        analysis.textFields.push(field);
        // Identifier les champs catégoriels potentiels
        if (field.name.includes('categor') || 
              field.name.includes('type') || 
              field.name.includes('statut') ||
              field.name.includes('region') ||
              field.name.includes('dep')) {
          analysis.categoryFields.push(field);
        }
        break;
      case 'int':
      case 'double':
      case 'decimal':
        analysis.numberFields.push(field);
        break;
      case 'date':
      case 'datetime':
        analysis.dateFields.push(field);
        break;
      case 'geo_point_2d':
      case 'geo_shape':
        analysis.geoFields.push(field);
        break;
      }

      // Détecter les coordonnées géographiques
      if (field.name === 'latitude' || field.name === 'longitude' || 
          field.name === 'lat' || field.name === 'lon' || field.name === 'lng') {
        analysis.geoFields.push(field);
      }
    });

    return analysis;
  }

  analyzeData(records, fields) {
    return {
      dataTypes: {
        hasText: fields.some(f => f.type === 'text'),
        hasNumbers: fields.some(f => ['int', 'double', 'decimal'].includes(f.type)),
        hasDates: fields.some(f => ['date', 'datetime'].includes(f.type)),
        hasGeo: fields.some(f => ['geo_point_2d', 'geo_shape'].includes(f.type) || 
                                 f.name.includes('lat') || f.name.includes('lon')),
        hasCategories: fields.some(f => f.name.includes('categor') || f.name.includes('type'))
      },
      recordCount: records.length,
      completeness: this.calculateCompleteness(records, fields)
    };
  }

  calculateCompleteness(records, fields) {
    if (records.length === 0) return 100;
    
    // Calculer le pourcentage de complétude
    let totalValues = 0;
    let filledValues = 0;
    
    records.forEach(record => {
      fields.forEach(field => {
        totalValues++;
        if (record.fields && record.fields[field.name] !== null && 
            record.fields[field.name] !== undefined && 
            record.fields[field.name] !== '') {
          filledValues++;
        }
      });
    });
    
    return totalValues > 0 ? Math.round((filledValues / totalValues) * 100) : 0;
  }

  generateRecommendations(fieldAnalysis, dataAnalysis) {
    const recommendations = [];

    // Recommander une table pour tous les datasets
    recommendations.push({
      widget: 'table',
      reason: 'Affichage détaillé des données',
      priority: 'high',
      score: 100
    });

    // Recommander des facettes si catégories
    if (fieldAnalysis.categoryFields.length > 0) {
      recommendations.push({
        widget: 'facets',
        reason: `${fieldAnalysis.categoryFields.length} champs de catégories disponibles`,
        priority: 'high',
        score: 90
      });
    }

    // Recommander une carte si données géo
    if (fieldAnalysis.geoFields.length > 0) {
      recommendations.push({
        widget: 'map',
        reason: 'Données géographiques disponibles',
        priority: 'high',
        score: 95
      });
    }

    // Recommander des graphiques si données numériques
    if (fieldAnalysis.numberFields.length > 0) {
      recommendations.push({
        widget: 'chart',
        reason: `${fieldAnalysis.numberFields.length} champs numériques disponibles`,
        priority: 'medium',
        score: 85
      });

      recommendations.push({
        widget: 'kpi',
        reason: 'Indicateurs clés calculables',
        priority: 'medium',
        score: 80
      });
    }

    // Recommander timeline si dates
    if (fieldAnalysis.dateFields.length > 0) {
      recommendations.push({
        widget: 'timeline',
        reason: 'Données temporelles disponibles',
        priority: 'medium',
        score: 75
      });
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  identifyFacets(fieldAnalysis, dataAnalysis) {
    const facets = [];
    
    // Ajouter les champs catégoriels comme facettes
    fieldAnalysis.categoryFields.forEach(field => {
      facets.push({
        field: field.name,
        label: field.label || this.formatFieldName(field.name),
        type: 'category',
        disjunctive: true
      });
    });

    // Ajouter les dates comme facettes temporelles
    fieldAnalysis.dateFields.forEach(field => {
      if (field.name.includes('annee') || field.name.includes('year')) {
        facets.push({
          field: field.name,
          label: field.label || 'Année',
          type: 'year',
          disjunctive: false
        });
      }
    });

    return facets;
  }

  formatFieldName(fieldName) {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  getDefaultMetadata(datasetId) {
    return {
      fields: [
        { name: 'id', type: 'text', label: 'Identifiant' },
        { name: 'title', type: 'text', label: 'Titre' },
        { name: 'description', type: 'text', label: 'Description' },
        { name: 'date', type: 'date', label: 'Date' },
        { name: 'category', type: 'text', label: 'Catégorie' }
      ],
      metas: {
        title: datasetId,
        description: `Dataset ${datasetId}`
      }
    };
  }

  getDefaultAnalysis(datasetId) {
    return {
      dataset: datasetId,
      title: datasetId,
      description: '',
      recordsCount: 0,
      fields: {
        totalFields: 0,
        textFields: [],
        numberFields: [],
        dateFields: [],
        geoFields: [],
        categoryFields: [],
        allFields: []
      },
      dataTypes: {
        hasText: true,
        hasNumbers: false,
        hasDates: false,
        hasGeo: false,
        hasCategories: false
      },
      recommendations: [
        {
          widget: 'table',
          reason: 'Widget par défaut',
          priority: 'high',
          score: 100
        }
      ],
      facets: [],
      geoEnabled: false,
      timeEnabled: false,
      metadata: {}
    };
  }
}