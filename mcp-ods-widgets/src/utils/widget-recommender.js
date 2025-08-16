/**
 * Recommandeur de widgets basé sur l'analyse du dataset
 */

export class WidgetRecommender {
  constructor() {
    this.widgetCatalog = {
      table: {
        name: 'Tableau de données',
        requirements: [],
        score: 100,
        description: 'Affichage tabulaire avec tri et pagination'
      },
      chart: {
        name: 'Graphique',
        requirements: ['numbers', 'categories'],
        score: 85,
        description: 'Visualisation graphique des données'
      },
      map: {
        name: 'Carte',
        requirements: ['geo'],
        score: 95,
        description: 'Visualisation géographique'
      },
      facets: {
        name: 'Filtres à facettes',
        requirements: ['categories'],
        score: 90,
        description: 'Filtrage par catégories'
      },
      kpi: {
        name: 'Indicateurs clés',
        requirements: ['numbers'],
        score: 80,
        description: 'Métriques et statistiques'
      },
      timeline: {
        name: 'Timeline',
        requirements: ['dates'],
        score: 75,
        description: 'Visualisation temporelle'
      },
      calendar: {
        name: 'Calendrier',
        requirements: ['dates'],
        score: 70,
        description: 'Vue calendaire des événements'
      },
      gauge: {
        name: 'Jauge',
        requirements: ['numbers'],
        score: 65,
        description: 'Indicateur de progression'
      },
      tagcloud: {
        name: 'Nuage de mots',
        requirements: ['text', 'categories'],
        score: 60,
        description: 'Visualisation de fréquence'
      },
      treemap: {
        name: 'Treemap',
        requirements: ['categories', 'numbers'],
        score: 70,
        description: 'Visualisation hiérarchique'
      }
    };
  }

  recommend(analysis) {
    const recommendations = [];
    const capabilities = this.extractCapabilities(analysis);

    // Évaluer chaque widget
    Object.entries(this.widgetCatalog).forEach(([widgetId, widget]) => {
      const compatibility = this.evaluateCompatibility(widget, capabilities, analysis);
      
      if (compatibility.score > 0) {
        recommendations.push({
          id: widgetId,
          name: widget.name,
          description: widget.description,
          score: compatibility.score,
          reason: compatibility.reason,
          priority: this.getPriority(compatibility.score),
          config: this.generateConfig(widgetId, analysis)
        });
      }
    });

    // Trier par score et retourner
    return recommendations.sort((a, b) => b.score - a.score);
  }

  extractCapabilities(analysis) {
    return {
      hasText: analysis.fields.textFields.length > 0,
      hasNumbers: analysis.fields.numberFields.length > 0,
      hasDates: analysis.fields.dateFields.length > 0,
      hasGeo: analysis.fields.geoFields.length > 0,
      hasCategories: analysis.fields.categoryFields.length > 0,
      recordCount: analysis.recordsCount || 0,
      fieldCount: analysis.fields.totalFields || 0
    };
  }

  evaluateCompatibility(widget, capabilities, analysis) {
    let score = widget.score;
    let reasons = [];

    // Vérifier les requirements
    const requirementsMet = widget.requirements.every(req => {
      switch(req) {
        case 'text':
          return capabilities.hasText;
        case 'numbers':
          return capabilities.hasNumbers;
        case 'dates':
          return capabilities.hasDates;
        case 'geo':
          return capabilities.hasGeo;
        case 'categories':
          return capabilities.hasCategories;
        default:
          return true;
      }
    });

    if (!requirementsMet && widget.requirements.length > 0) {
      return { score: 0, reason: 'Données requises non disponibles' };
    }

    // Ajuster le score selon le contexte
    switch(widget.name) {
      case 'Tableau de données':
        reasons.push('Widget universel pour exploration des données');
        break;
        
      case 'Carte':
        if (capabilities.hasGeo) {
          score = 95;
          reasons.push(`${analysis.fields.geoFields.length} champs géographiques détectés`);
        }
        break;
        
      case 'Graphique':
        if (capabilities.hasNumbers && capabilities.hasCategories) {
          const numFields = analysis.fields.numberFields.length;
          const catFields = analysis.fields.categoryFields.length;
          score = Math.min(95, 85 + numFields * 2);
          reasons.push(`${numFields} métriques et ${catFields} dimensions disponibles`);
        }
        break;
        
      case 'Filtres à facettes':
        if (capabilities.hasCategories) {
          const catCount = analysis.fields.categoryFields.length;
          score = Math.min(95, 90 + catCount);
          reasons.push(`${catCount} dimensions filtrables`);
        }
        break;
        
      case 'Indicateurs clés':
        if (capabilities.hasNumbers) {
          const numCount = analysis.fields.numberFields.length;
          score = Math.min(90, 80 + numCount * 2);
          reasons.push(`${numCount} métriques calculables`);
        }
        break;
        
      case 'Timeline':
        if (capabilities.hasDates) {
          score = 85;
          reasons.push('Données temporelles disponibles pour chronologie');
        }
        break;
    }

    // Bonus pour les grandes quantités de données
    if (capabilities.recordCount > 1000) {
      score += 5;
      reasons.push('Grand volume de données');
    }

    return {
      score: Math.min(100, score),
      reason: reasons.join(', ') || widget.description
    };
  }

  getPriority(score) {
    if (score >= 90) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  }

  generateConfig(widgetId, analysis) {
    const config = {
      widget: widgetId,
      dataset: analysis.dataset
    };

    switch(widgetId) {
      case 'table':
        config.fields = analysis.fields.allFields
          .slice(0, 8)
          .map(f => f.name);
        config.pagination = true;
        config.pageSize = 20;
        config.search = true;
        break;
        
      case 'chart':
        if (analysis.fields.dateFields.length > 0) {
          config.xAxis = analysis.fields.dateFields[0].name;
          config.chartType = 'line';
        } else if (analysis.fields.categoryFields.length > 0) {
          config.xAxis = analysis.fields.categoryFields[0].name;
          config.chartType = 'column';
        }
        
        if (analysis.fields.numberFields.length > 0) {
          config.yAxis = analysis.fields.numberFields[0].name;
          config.function = 'SUM';
        } else {
          config.function = 'COUNT';
        }
        break;
        
      case 'map':
        if (analysis.fields.geoFields.length > 0) {
          const geoField = analysis.fields.geoFields[0];
          if (geoField.type === 'geo_point_2d') {
            config.geoField = geoField.name;
          } else if (geoField.name === 'latitude' || geoField.name === 'longitude') {
            config.latField = 'latitude';
            config.lonField = 'longitude';
          }
        }
        config.clustering = true;
        config.basemap = 'jawg.light';
        break;
        
      case 'facets':
        config.facets = analysis.fields.categoryFields
          .slice(0, 5)
          .map(f => ({
            field: f.name,
            label: f.label || this.formatFieldName(f.name),
            disjunctive: true
          }));
        break;
        
      case 'kpi':
        config.kpis = [];
        
        // KPI total
        config.kpis.push({
          function: 'COUNT',
          label: 'Total enregistrements',
          icon: 'fr-icon-database-2-line'
        });
        
        // KPIs numériques
        analysis.fields.numberFields.slice(0, 3).forEach(field => {
          config.kpis.push({
            field: field.name,
            function: 'SUM',
            label: `Total ${field.label || field.name}`,
            icon: 'fr-icon-bar-chart-box-line'
          });
        });
        break;
        
      case 'timeline':
        if (analysis.fields.dateFields.length > 0) {
          config.dateField = analysis.fields.dateFields[0].name;
          config.groupBy = 'month';
        }
        break;
    }

    return config;
  }

  formatFieldName(fieldName) {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  getBestCombination(analysis, maxWidgets = 4) {
    const recommendations = this.recommend(analysis);
    const selected = [];
    const usedTypes = new Set();

    // Toujours inclure une table
    selected.push(recommendations.find(r => r.id === 'table'));
    usedTypes.add('table');

    // Ajouter les widgets complémentaires
    for (const rec of recommendations) {
      if (selected.length >= maxWidgets) break;
      
      // Éviter les doublons de type similaire
      if (usedTypes.has(rec.id)) continue;
      
      // Vérifier la complémentarité
      if (this.isComplementary(rec.id, Array.from(usedTypes))) {
        selected.push(rec);
        usedTypes.add(rec.id);
      }
    }

    return selected.filter(Boolean);
  }

  isComplementary(widgetId, existingTypes) {
    const complementaryPairs = {
      'table': ['chart', 'map', 'facets'],
      'chart': ['table', 'kpi', 'facets'],
      'map': ['table', 'facets', 'kpi'],
      'facets': ['table', 'chart', 'map'],
      'kpi': ['chart', 'table'],
      'timeline': ['table', 'chart']
    };

    const complements = complementaryPairs[widgetId] || [];
    return existingTypes.some(type => complements.includes(type));
  }
}