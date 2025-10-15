import express from 'express';
import { Material } from '../models/Material';
import { MaterialSelectionService } from '../services/MaterialSelectionService';
import { validateMaterialQuery } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = express.Router();
const materialService = new MaterialSelectionService();

// Get all materials with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      domain,
      recyclable,
      search,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const filter: any = {};
    
    if (category) filter.category = category;
    if (domain) filter['applications.domain'] = domain;
    if (recyclable !== undefined) filter['sustainability.recyclable'] = recyclable === 'true';
    if (search) {
      filter.$text = { $search: search as string };
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const materials = await Material.find(filter)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Material.countDocuments(filter);

    res.json({
      materials,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get material by ID
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    return res.json(material);
  } catch (error) {
    logger.error('Error fetching material:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Advanced material search with AI-powered matching
router.post('/search', validateMaterialQuery, async (req, res) => {
  try {
    const {
      requirements,
      domain,
      conditions,
      priorities,
      constraints
    } = req.body;

    const recommendations = await materialService.findMaterials({
      requirements,
      domain,
      conditions,
      priorities,
      constraints
    });

    res.json({
      recommendations,
      searchCriteria: req.body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in material search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Compare materials
router.post('/compare', async (req, res) => {
  try {
    const { materialIds } = req.body;
    
    if (!Array.isArray(materialIds) || materialIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 material IDs required for comparison' });
    }

    const materials = await Material.find({ _id: { $in: materialIds } });
    
    if (materials.length !== materialIds.length) {
      return res.status(404).json({ error: 'One or more materials not found' });
    }

    const comparison = await materialService.compareMaterials(materials);
    
    return res.json(comparison);
  } catch (error) {
    logger.error('Error comparing materials:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get materials by standard
router.get('/standards/:organization/:designation', async (req, res) => {
  try {
    const { organization, designation } = req.params;
    
    const materials = await Material.find({
      'standards.organization': organization.toUpperCase(),
      'standards.designation': designation.toUpperCase()
    });

    res.json(materials);
  } catch (error) {
    logger.error('Error fetching materials by standard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sustainability report
router.get('/sustainability/report', async (req, res) => {
  try {
    const report = await materialService.generateSustainabilityReport();
    res.json(report);
  } catch (error) {
    logger.error('Error generating sustainability report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;