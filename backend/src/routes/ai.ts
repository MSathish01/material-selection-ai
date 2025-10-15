import express from 'express';
import { OpenAIService } from '../services/OpenAIService';
import { logger } from '../utils/logger';

const router = express.Router();
const openAIService = new OpenAIService();

// Analyze material requirements from natural language
router.post('/analyze-requirements', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Description is required' });
    }

    const requirements = await openAIService.analyzeMaterialRequirements(description);

    res.json({
      originalDescription: description,
      extractedRequirements: requirements,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Requirements analysis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate material reasoning
router.post('/explain-selection', async (req, res) => {
  try {
    const { materialName, applicationContext, requirements } = req.body;

    if (!materialName || !applicationContext) {
      return res.status(400).json({ error: 'Material name and application context are required' });
    }

    const prompt = `
      Explain why ${materialName} is suitable for ${applicationContext}.
      
      ${requirements ? `Requirements: ${JSON.stringify(requirements)}` : ''}
      
      Provide a detailed technical explanation covering:
      1. Material properties that make it suitable
      2. Performance advantages
      3. Potential limitations or considerations
      4. Comparison with alternative materials
    `;

    const explanation = await openAIService.generateReasoning(prompt);

    res.json({
      materialName,
      applicationContext,
      explanation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Selection explanation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Material behavior simulation
router.post('/simulate-behavior', async (req, res) => {
  try {
    const { materialName, conditions, timeframe } = req.body;

    if (!materialName || !Array.isArray(conditions)) {
      return res.status(400).json({ error: 'Material name and conditions array are required' });
    }

    const simulation = await openAIService.simulateMaterialBehavior(materialName, conditions);

    res.json({
      materialName,
      conditions,
      timeframe: timeframe || 'long-term',
      simulation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Behavior simulation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;