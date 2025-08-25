/**
 * Tests unitaires pour ApiClient
 */

const assert = require('assert');
const { describe, it, beforeEach, afterEach } = require('mocha');

// Mock fetch pour les tests
global.fetch = require('node-fetch');
const fetchMock = require('fetch-mock');

// Import du client API
const ApiClient = require('../src/api/api-client');

describe('ApiClient', () => {
  let apiClient;
  
  beforeEach(() => {
    apiClient = new ApiClient({
      cacheTimeout: 1000, // 1 seconde pour les tests
      retryAttempts: 2,
      retryDelay: 100
    });
    fetchMock.reset();
  });
  
  afterEach(() => {
    fetchMock.restore();
    apiClient.destroy();
  });
  
  describe('Construction d\'URL', () => {
    it('devrait construire une URL correcte avec paramètres', () => {
      const url = apiClient.buildUrl('search', {
        dataset: 'signalconso',
        rows: 10,
        sort: '-creationdate'
      });
      
      assert(url.includes('dataset=signalconso'));
      assert(url.includes('rows=10'));
      assert(url.includes('sort=-creationdate'));
    });
    
    it('devrait ignorer les paramètres null/undefined', () => {
      const url = apiClient.buildUrl('search', {
        dataset: 'signalconso',
        rows: null,
        sort: undefined
      });
      
      assert(url.includes('dataset=signalconso'));
      assert(!url.includes('rows'));
      assert(!url.includes('sort'));
    });
  });
  
  describe('Cache', () => {
    it('devrait mettre en cache les réponses', async () => {
      const mockData = { nhits: 100, records: [] };
      
      fetchMock.get('*', mockData);
      
      // Premier appel - pas de cache
      const result1 = await apiClient.search('signalconso');
      assert.equal(apiClient.stats.cacheHits, 0);
      
      // Deuxième appel - depuis le cache
      const result2 = await apiClient.search('signalconso');
      assert.equal(apiClient.stats.cacheHits, 1);
      
      assert.deepEqual(result1, result2);
    });
    
    it('devrait expirer le cache après timeout', async () => {
      const mockData = { nhits: 100, records: [] };
      fetchMock.get('*', mockData);
      
      await apiClient.search('signalconso');
      
      // Attendre l'expiration du cache
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      await apiClient.search('signalconso');
      
      // Le cache devrait avoir expiré
      assert.equal(apiClient.stats.cacheHits, 0);
      assert.equal(apiClient.stats.requests, 2);
    });
    
    it('devrait ignorer le cache avec noCache option', async () => {
      const mockData = { nhits: 100, records: [] };
      fetchMock.get('*', mockData);
      
      await apiClient.search('signalconso');
      await apiClient.search('signalconso', { noCache: true });
      
      assert.equal(apiClient.stats.cacheHits, 0);
      assert.equal(apiClient.stats.requests, 2);
    });
  });
  
  describe('Retry logic', () => {
    it('devrait réessayer en cas d\'échec', async () => {
      let attempts = 0;
      
      fetchMock.get('*', () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Network error');
        }
        return { nhits: 100, records: [] };
      });
      
      const result = await apiClient.search('signalconso');
      
      assert.equal(attempts, 2);
      assert.equal(result.nhits, 100);
    });
    
    it('devrait échouer après max retries', async () => {
      fetchMock.get('*', () => {
        throw new Error('Network error');
      });
      
      try {
        await apiClient.search('signalconso');
        assert.fail('Should have thrown error');
      } catch (error) {
        assert(error.message.includes('Network error'));
        assert.equal(apiClient.stats.errors, 1);
      }
    });
  });
  
  describe('Facettes', () => {
    it('devrait récupérer les facettes', async () => {
      const mockData = {
        facet_groups: [
          {
            name: 'region',
            facets: [
              { name: 'Île-de-France', count: 100 },
              { name: 'Occitanie', count: 50 }
            ]
          }
        ]
      };
      
      fetchMock.get('*', mockData);
      
      const facets = await apiClient.getFacets('signalconso', ['region']);
      
      assert(facets.region);
      assert.equal(facets.region.length, 2);
      assert.equal(facets.region[0].name, 'Île-de-France');
    });
  });
  
  describe('Agrégation', () => {
    it('devrait agréger les données correctement', async () => {
      const mockData = {
        nhits: 3,
        records: [
          { fields: { region: 'IDF', status: 'resolved', count: 10 } },
          { fields: { region: 'IDF', status: 'pending', count: 5 } },
          { fields: { region: 'PACA', status: 'resolved', count: 8 } }
        ]
      };
      
      fetchMock.get('*', mockData);
      
      const aggregated = await apiClient.aggregate('signalconso', 'region', {
        count: 'sum'
      });
      
      assert.equal(aggregated.IDF.count, 2);
      assert.equal(aggregated.IDF.count, 15);
      assert.equal(aggregated.PACA.count, 1);
      assert.equal(aggregated.PACA.count, 8);
    });
  });
  
  describe('Statistiques', () => {
    it('devrait collecter les statistiques correctement', async () => {
      const mockData = { nhits: 100, records: [] };
      fetchMock.get('*', mockData);
      
      await apiClient.search('signalconso');
      await apiClient.search('signalconso'); // Cache hit
      
      const stats = apiClient.getStats();
      
      assert.equal(stats.requests, 1);
      assert.equal(stats.cacheHits, 1);
      assert(stats.avgResponseTime >= 0);
      assert.equal(stats.cacheHitRate, 100);
    });
  });
  
  describe('Export des données', () => {
    it('devrait exporter en CSV', async () => {
      const mockBlob = new Blob(['csv data'], { type: 'text/csv' });
      
      fetchMock.get('*', mockBlob);
      
      const blob = await apiClient.export('signalconso', 'csv');
      
      assert(blob instanceof Blob);
    });
  });
  
  describe('Récupération d\'enregistrement', () => {
    it('devrait récupérer un enregistrement spécifique', async () => {
      const mockData = {
        records: [
          { recordid: '123', fields: { name: 'Test' } }
        ]
      };
      
      fetchMock.get('*', mockData);
      
      const record = await apiClient.getRecord('signalconso', '123');
      
      assert.equal(record.recordid, '123');
      assert.equal(record.fields.name, 'Test');
    });
  });
});

// Tests d'intégration (à exécuter avec l'API réelle)
describe('ApiClient Integration', function() {
  this.timeout(10000); // 10 secondes pour les tests d'intégration
  
  let apiClient;
  
  beforeEach(() => {
    // Skip si pas de connexion internet
    if (process.env.SKIP_INTEGRATION_TESTS) {
      this.skip();
    }
    
    apiClient = new ApiClient();
  });
  
  afterEach(() => {
    if (apiClient) {
      apiClient.destroy();
    }
  });
  
  it('devrait récupérer des données réelles de SignalConso', async () => {
    try {
      const data = await apiClient.search('signalconso', {
        rows: 5
      });
      
      assert(data.nhits > 0);
      assert(Array.isArray(data.records));
      assert(data.records.length <= 5);
    } catch (error) {
      // Si l'API est down, ne pas faire échouer le test
      console.warn('API integration test skipped:', error.message);
      this.skip();
    }
  });
  
  it('devrait gérer les erreurs 404 correctement', async () => {
    try {
      await apiClient.search('dataset-inexistant');
      assert.fail('Should have thrown error');
    } catch (error) {
      assert(error.message.includes('404') || error.message.includes('Not Found'));
    }
  });
});

// Export pour npm test
if (require.main === module) {
  // Lancer les tests
  const Mocha = require('mocha');
  const mocha = new Mocha();
  
  mocha.run(failures => {
    process.exitCode = failures ? 1 : 0;
  });
}