import express from 'express';
import { Material } from '../models/Material';
import { logger } from '../utils/logger';

const router = express.Router();

// Get all available standards
router.get('/', async (req, res) => {
  try {
    const standards = await Material.aggregate([
      { $unwind: '$standards' },
      {
        $group: {
          _id: {
            organization: '$standards.organization',
            designation: '$standards.designation'
          },
          title: { $first: '$standards.title' },
          year: { $first: '$standards.year' },
          materialCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          organization: '$_id.organization',
          designation: '$_id.designation',
          title: 1,
          year: 1,
          materialCount: 1
        }
      },
      { $sort: { organization: 1, designation: 1 } }
    ]);

    res.json(standards);
  } catch (error) {
    logger.error('Error fetching standards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get standards by organization
router.get('/:organization', async (req, res) => {
  try {
    const { organization } = req.params;
    
    const standards = await Material.aggregate([
      { $unwind: '$standards' },
      { $match: { 'standards.organization': organization.toUpperCase() } },
      {
        $group: {
          _id: '$standards.designation',
          title: { $first: '$standards.title' },
          year: { $first: '$standards.year' },
          materialCount: { $sum: 1 },
          materials: { $push: '$name' }
        }
      },
      {
        $project: {
          _id: 0,
          designation: '$_id',
          title: 1,
          year: 1,
          materialCount: 1,
          materials: 1
        }
      },
      { $sort: { designation: 1 } }
    ]);

    res.json({
      organization: organization.toUpperCase(),
      standards
    });
  } catch (error) {
    logger.error('Error fetching standards by organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get materials by specific standard
router.get('/:organization/:designation', async (req, res) => {
  try {
    const { organization, designation } = req.params;
    
    const materials = await Material.find({
      'standards.organization': organization.toUpperCase(),
      'standards.designation': designation.toUpperCase()
    }).select('name category properties standards applications');

    if (materials.length === 0) {
      return res.status(404).json({ error: 'No materials found for this standard' });
    }

    res.json({
      standard: {
        organization: organization.toUpperCase(),
        designation: designation.toUpperCase()
      },
      materials
    });
  } catch (error) {
    logger.error('Error fetching materials by standard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search standards
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    const standards = await Material.aggregate([
      { $unwind: '$standards' },
      {
        $match: {
          $or: [
            { 'standards.designation': { $regex: query, $options: 'i' } },
            { 'standards.title': { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: {
            organization: '$standards.organization',
            designation: '$standards.designation'
          },
          title: { $first: '$standards.title' },
          year: { $first: '$standards.year' },
          materialCount: { $sum: 1 },
          materials: { $push: '$name' }
        }
      },
      {
        $project: {
          _id: 0,
          organization: '$_id.organization',
          designation: '$_id.designation',
          title: 1,
          year: 1,
          materialCount: 1,
          materials: 1
        }
      },
      { $sort: { organization: 1, designation: 1 } }
    ]);

    res.json({
      query,
      results: standards
    });
  } catch (error) {
    logger.error('Error searching standards:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get compliance report for materials
router.post('/compliance-check', async (req, res) => {
  try {
    const { materialIds, requiredStandards } = req.body;

    if (!Array.isArray(materialIds) || !Array.isArray(requiredStandards)) {
      return res.status(400).json({ error: 'Material IDs and required standards arrays are required' });
    }

    const materials = await Material.find({ _id: { $in: materialIds } });
    
    const complianceReport = materials.map(material => {
      const materialStandards = material.standards.map(s => `${s.organization}-${s.designation}`);
      const compliantStandards = requiredStandards.filter(req => 
        materialStandards.some(mat => mat.toLowerCase().includes(req.toLowerCase()))
      );
      const missingStandards = requiredStandards.filter(req => 
        !materialStandards.some(mat => mat.toLowerCase().includes(req.toLowerCase()))
      );

      return {
        materialId: material._id,
        materialName: material.name,
        compliantStandards,
        missingStandards,
        compliancePercentage: (compliantStandards.length / requiredStandards.length) * 100,
        allStandards: material.standards
      };
    });

    res.json({
      requiredStandards,
      complianceReport,
      summary: {
        totalMaterials: materials.length,
        fullyCompliant: complianceReport.filter(r => r.compliancePercentage === 100).length,
        partiallyCompliant: complianceReport.filter(r => r.compliancePercentage > 0 && r.compliancePercentage < 100).length,
        nonCompliant: complianceReport.filter(r => r.compliancePercentage === 0).length
      }
    });
  } catch (error) {
    logger.error('Error in compliance check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;