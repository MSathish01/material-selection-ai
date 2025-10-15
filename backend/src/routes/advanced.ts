import express from 'express';
import { GenerativeMaterialService } from '../services/GenerativeMaterialService';
import { DigitalTwinService } from '../services/DigitalTwinService';
import { MultiObjectiveOptimizationService } from '../services/MultiObjectiveOptimizationService';
import { ActiveLearningService } from '../services/ActiveLearningService';
import { SupplyChainService } from '../services/SupplyChainService';
import { FailurePredictionService } from '../services/FailurePredictionService';
import { Material } from '../models/Material';
import { logger } from '../utils/logger';

const router = express.Router();

const generativeService = new GenerativeMaterialService();
const digitalTwinService = new DigitalTwinService();
const optimizationService = new MultiObjectiveOptimizationService();
const activeLearningService = new ActiveLearningService();
const supplyChainService = new SupplyChainService();
const failurePredictionService = new FailurePredictionService();

// Generative Material Discovery
router.post('/generate-material', async (req, res) => {
  try {
    const { targetProperties } = req.body;
    const generatedMaterial = await generativeService.generateMaterial(targetProperties);
    res.json(generatedMaterial);
  } catch (error: any) {
    logger.error('Error generating material:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/optimize-composition', async (req, res) => {
  try {
    const { composition, constraints } = req.body;
    const variants = await generativeService.optimizeComposition(composition, constraints);
    res.json({ variants });
  } catch (error: any) {
    logger.error('Error optimizing composition:', error);
    res.status(500).json({ error: error.message });
  }
});

// Digital Twin Management
router.post('/digital-twin/create', async (req, res) => {
  try {
    const { materialId, materialName, deploymentData } = req.body;
    const twin = await digitalTwinService.createDigitalTwin(materialId, materialName, deploymentData);
    res.json(twin);
  } catch (error: any) {
    logger.error('Error creating digital twin:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/digital-twin/:materialId/update', async (req, res) => {
  try {
    const { materialId } = req.params;
    const { sensorData } = req.body;
    await digitalTwinService.updateRealTimeData(materialId, sensorData);
    const twin = await digitalTwinService.getDigitalTwin(materialId);
    res.json(twin);
  } catch (error: any) {
    logger.error('Error updating digital twin:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/digital-twin/:materialId', async (req, res) => {
  try {
    const { materialId } = req.params;
    const twin = await digitalTwinService.getDigitalTwin(materialId);
    if (!twin) {
      return res.status(404).json({ error: 'Digital twin not found' });
    }
    res.json(twin);
  } catch (error: any) {
    logger.error('Error fetching digital twin:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/digital-twin/:materialId/predict-failure', async (req, res) => {
  try {
    const { materialId } = req.params;
    const prediction = await digitalTwinService.predictFailure(materialId);
    res.json(prediction);
  } catch (error: any) {
    logger.error('Error predicting failure:', error);
    res.status(500).json({ error: error.message });
  }
});

// Multi-Objective Optimization
router.post('/optimize/multi-objective', async (req, res) => {
  try {
    const { materialIds, objectives } = req.body;
    
    const materials = await Material.find({ _id: { $in: materialIds } });
    const solutions = await optimizationService.optimizeMaterials(materials, objectives);
    const paretoFront = await optimizationService.generateParetoFront(solutions);
    
    res.json({
      solutions: solutions.slice(0, 20), // Top 20 solutions
      paretoFront
    });
  } catch (error: any) {
    logger.error('Error in multi-objective optimization:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/optimize/pareto-analysis', async (req, res) => {
  try {
    const { query, objectives } = req.body;
    
    // Get materials matching basic criteria
    const materials = await Material.find(query || {}).limit(50);
    
    if (materials.length === 0) {
      return res.status(404).json({ error: 'No materials found matching criteria' });
    }

    const solutions = await optimizationService.optimizeMaterials(materials, objectives);
    const paretoFront = await optimizationService.generateParetoFront(solutions);
    
    res.json(paretoFront);
  } catch (error: any) {
    logger.error('Error in Pareto analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

// Active Learning
router.post('/active-learning/suggest-experiment', async (req, res) => {
  try {
    const { property, existingData, constraints } = req.body;
    const suggestion = await activeLearningService.suggestNextExperiment(property, existingData, constraints);
    res.json(suggestion);
  } catch (error: any) {
    logger.error('Error suggesting experiment:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/active-learning/optimize-campaign', async (req, res) => {
  try {
    const { property, budget, existingData } = req.body;
    const campaign = await activeLearningService.optimizeExperimentalCampaign(property, budget, existingData);
    res.json({ campaign });
  } catch (error: any) {
    logger.error('Error optimizing campaign:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/active-learning/data-gaps', async (req, res) => {
  try {
    const materials = await Material.find().limit(100);
    const gaps = await activeLearningService.analyzeDataGaps(materials);
    res.json(gaps);
  } catch (error: any) {
    logger.error('Error analyzing data gaps:', error);
    res.status(500).json({ error: error.message });
  }
});

// Supply Chain Intelligence
router.get('/supply-chain/:materialName/suppliers', async (req, res) => {
  try {
    const { materialName } = req.params;
    const suppliers = await supplyChainService.getSupplierInfo(materialName);
    res.json({ suppliers });
  } catch (error: any) {
    logger.error('Error fetching suppliers:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/supply-chain/:materialName/pricing', async (req, res) => {
  try {
    const { materialName } = req.params;
    const pricing = await supplyChainService.analyzePricing(materialName);
    res.json(pricing);
  } catch (error: any) {
    logger.error('Error analyzing pricing:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/supply-chain/:materialName/lead-time', async (req, res) => {
  try {
    const { materialName } = req.params;
    const { quantity, location } = req.body;
    const leadTime = await supplyChainService.getLeadTimeEstimate(materialName, quantity, location);
    res.json(leadTime);
  } catch (error: any) {
    logger.error('Error estimating lead time:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/supply-chain/:materialName/analysis', async (req, res) => {
  try {
    const { materialName } = req.params;
    const analysis = await supplyChainService.performSupplyChainAnalysis(materialName);
    res.json(analysis);
  } catch (error: any) {
    logger.error('Error performing supply chain analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/supply-chain/track/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const tracking = await supplyChainService.trackShipment(orderId);
    res.json(tracking);
  } catch (error: any) {
    logger.error('Error tracking shipment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Failure Prediction
router.post('/failure-prediction/predict', async (req, res) => {
  try {
    const { materialId, operatingConditions } = req.body;
    
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const prediction = await failurePredictionService.predictFailure(material, operatingConditions);
    res.json(prediction);
  } catch (error: any) {
    logger.error('Error predicting failure:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/failure-prediction/simulate', async (req, res) => {
  try {
    const { materialId, scenario } = req.body;
    
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const simulation = await failurePredictionService.simulateFailureScenario(material, scenario);
    res.json(simulation);
  } catch (error: any) {
    logger.error('Error simulating failure:', error);
    res.status(500).json({ error: error.message });
  }
});

// Combined Advanced Analysis
router.post('/advanced-analysis', async (req, res) => {
  try {
    const { materialId, analysisType, parameters } = req.body;
    
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const results: any = {
      material: material.name,
      analysisType
    };

    // Perform requested analyses
    if (analysisType.includes('failure')) {
      results.failurePrediction = await failurePredictionService.predictFailure(
        material,
        parameters.operatingConditions
      );
    }

    if (analysisType.includes('supply-chain')) {
      results.supplyChain = await supplyChainService.performSupplyChainAnalysis(material.name);
    }

    if (analysisType.includes('digital-twin')) {
      const twin = await digitalTwinService.getDigitalTwin(materialId);
      if (twin) {
        results.digitalTwin = twin;
        results.failureRisk = await digitalTwinService.predictFailure(materialId);
      }
    }

    res.json(results);
  } catch (error: any) {
    logger.error('Error in advanced analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

// Dashboard Statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const totalMaterials = await Material.countDocuments();
    const materials = await Material.find().limit(50);
    
    // Calculate various statistics
    const stats = {
      totalMaterials,
      generatedMaterials: 0, // Would track generated materials
      activeTwins: 0, // Would track active digital twins
      optimizationRuns: 0, // Would track optimization runs
      experimentsSuggested: 0, // Would track suggested experiments
      averageSustainability: materials.reduce((sum, m) => 
        sum + (m.sustainability.recyclable ? 1 : 0), 0) / materials.length * 100,
      supplyChainHealth: 85, // Mock value
      predictedFailures: 0 // Would track predicted failures
    };

    res.json(stats);
  } catch (error: any) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
