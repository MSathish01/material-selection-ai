import express from 'express';
import { OpenAIService } from '../services/OpenAIService';
import { MaterialSelectionService } from '../services/MaterialSelectionService';
import { logger } from '../utils/logger';

const router = express.Router();
const openAIService = new OpenAIService();
const materialService = new MaterialSelectionService();

// Chat endpoint for interactive material selection
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if the message is asking for material recommendations
    const isSelectionQuery = /find|recommend|suggest|select|material|steel|aluminum|polymer/i.test(message);
    
    let response: any = {
      message: '',
      type: 'text',
      sessionId: sessionId || Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    if (isSelectionQuery) {
      // Extract requirements using AI
      const requirements = await openAIService.analyzeMaterialRequirements(message);
      
      // Find materials based on extracted requirements
      const recommendations = await materialService.findMaterials(requirements);
      
      if (recommendations.length > 0) {
        response.type = 'material_recommendations';
        response.recommendations = recommendations.slice(0, 5); // Top 5
        response.message = `I found ${recommendations.length} materials that match your requirements. Here are the top recommendations:`;
        response.searchCriteria = requirements;
      } else {
        response.message = 'I couldn\'t find materials matching your specific requirements. Could you provide more details about your application?';
      }
    } else {
      // General chat response
      response.message = await openAIService.generateChatResponse(message, context);
    }

    res.json(response);
  } catch (error) {
    logger.error('Chat message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get material simulation
router.post('/simulate', async (req, res) => {
  try {
    const { materialName, conditions } = req.body;

    if (!materialName || !Array.isArray(conditions)) {
      return res.status(400).json({ error: 'Material name and conditions array are required' });
    }

    const simulation = await openAIService.simulateMaterialBehavior(materialName, conditions);

    res.json({
      materialName,
      conditions,
      simulation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Material simulation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get conversation history (placeholder for future implementation)
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // In a real implementation, you would fetch from a database
    // For now, return empty history
    res.json({
      sessionId,
      messages: [],
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Chat history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Material selection wizard - step by step guidance
router.post('/wizard/start', async (req, res) => {
  try {
    const wizardSession = {
      id: Date.now().toString(),
      step: 1,
      totalSteps: 5,
      data: {},
      questions: [
        {
          step: 1,
          question: "What is your primary application domain?",
          type: "select",
          options: ["cryogenics", "mining", "oil_gas", "subsea", "hygienic", "power", "general"]
        },
        {
          step: 2,
          question: "What are the operating conditions?",
          type: "multiselect",
          options: ["high_temperature", "low_temperature", "high_pressure", "corrosive", "abrasive", "vacuum", "underwater"]
        },
        {
          step: 3,
          question: "What are your mechanical requirements?",
          type: "form",
          fields: [
            { name: "tensileStrength", label: "Minimum Tensile Strength (MPa)", type: "number" },
            { name: "yieldStrength", label: "Minimum Yield Strength (MPa)", type: "number" },
            { name: "hardness", label: "Minimum Hardness (HRC)", type: "number" }
          ]
        },
        {
          step: 4,
          question: "What are your priorities?",
          type: "slider",
          fields: [
            { name: "performance", label: "Performance", min: 1, max: 10 },
            { name: "cost", label: "Cost Effectiveness", min: 1, max: 10 },
            { name: "sustainability", label: "Sustainability", min: 1, max: 10 },
            { name: "availability", label: "Availability", min: 1, max: 10 }
          ]
        },
        {
          step: 5,
          question: "Any additional constraints?",
          type: "form",
          fields: [
            { name: "maxCost", label: "Maximum Cost Index (1-10)", type: "number" },
            { name: "maxLeadTime", label: "Maximum Lead Time (days)", type: "number" },
            { name: "requiredStandards", label: "Required Standards (comma-separated)", type: "text" }
          ]
        }
      ]
    };

    res.json(wizardSession);
  } catch (error) {
    logger.error('Wizard start error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update wizard step
router.post('/wizard/:sessionId/step/:step', async (req, res) => {
  try {
    const { sessionId, step } = req.params;
    const { data } = req.body;

    // In a real implementation, you would store this in a database
    // For now, just return the next step or results

    const stepNum = parseInt(step);
    
    if (stepNum >= 5) {
      // Final step - generate recommendations
      const query = {
        requirements: {
          mechanical: data.mechanical || {},
          thermal: data.thermal || {},
          chemical: data.chemical || {}
        },
        domain: data.domain || 'general',
        conditions: data.conditions || [],
        priorities: data.priorities || { performance: 8, cost: 5, sustainability: 5, availability: 6 },
        constraints: data.constraints || {}
      };

      const recommendations = await materialService.findMaterials(query);

      res.json({
        sessionId,
        completed: true,
        recommendations: recommendations.slice(0, 10),
        query
      });
    } else {
      res.json({
        sessionId,
        step: stepNum + 1,
        completed: false,
        message: `Step ${stepNum} completed. Proceeding to step ${stepNum + 1}.`
      });
    }
  } catch (error) {
    logger.error('Wizard step error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;