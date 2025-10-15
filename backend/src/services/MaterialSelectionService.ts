import { Material, IMaterial } from '../models/Material';
import { OpenAIService } from './OpenAIService';
import { logger } from '../utils/logger';

export interface MaterialQuery {
  requirements: {
    mechanical?: {
      tensileStrength?: { min?: number; max?: number };
      yieldStrength?: { min?: number; max?: number };
      hardness?: { min?: number; max?: number };
    };
    thermal?: {
      operatingTemperature?: { min?: number; max?: number };
      thermalConductivity?: { min?: number; max?: number };
    };
    chemical?: {
      corrosionResistance?: string;
      chemicalCompatibility?: string[];
    };
  };
  domain: string;
  conditions: string[];
  priorities: {
    sustainability?: number; // 1-10
    cost?: number; // 1-10
    performance?: number; // 1-10
    availability?: number; // 1-10
  };
  constraints?: {
    maxCost?: number;
    maxLeadTime?: number;
    requiredStandards?: string[];
    excludeMaterials?: string[];
  };
}

export interface MaterialRecommendation {
  material: IMaterial;
  score: number;
  reasoning: string;
  matchDetails: {
    mechanicalMatch: number;
    thermalMatch: number;
    chemicalMatch: number;
    sustainabilityScore: number;
    costScore: number;
    availabilityScore: number;
  };
  risks: string[];
  alternatives: string[];
}

export class MaterialSelectionService {
  private openAIService: OpenAIService;

  constructor() {
    this.openAIService = new OpenAIService();
  }

  async findMaterials(query: MaterialQuery): Promise<MaterialRecommendation[]> {
    try {
      // Build MongoDB query based on requirements
      const mongoQuery = this.buildMongoQuery(query);
      
      // Get candidate materials
      const candidates = await Material.find(mongoQuery).lean();
      
      if (candidates.length === 0) {
        logger.warn('No materials found matching basic criteria');
        return [];
      }

      // Score and rank materials
      const scoredMaterials = await Promise.all(
        candidates.map(material => this.scoreMaterial(material as any, query))
      );

      // Sort by score and return top recommendations
      const recommendations = scoredMaterials
        .filter(rec => rec.score > 0.3) // Minimum threshold
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      // Enhance with AI reasoning
      for (const recommendation of recommendations) {
        recommendation.reasoning = await this.generateAIReasoning(
          recommendation.material,
          query
        );
      }

      return recommendations;
    } catch (error) {
      logger.error('Error in material selection:', error);
      throw error;
    }
  }

  private buildMongoQuery(query: MaterialQuery): any {
    const mongoQuery: any = {};

    // Domain filter
    if (query.domain) {
      mongoQuery['applications.domain'] = query.domain;
    }

    // Mechanical requirements
    if (query.requirements.mechanical) {
      const mech = query.requirements.mechanical;
      if (mech.tensileStrength?.min) {
        mongoQuery['properties.mechanical.tensileStrength'] = { 
          $gte: mech.tensileStrength.min 
        };
      }
      if (mech.yieldStrength?.min) {
        mongoQuery['properties.mechanical.yieldStrength'] = { 
          $gte: mech.yieldStrength.min 
        };
      }
    }

    // Thermal requirements
    if (query.requirements.thermal?.operatingTemperature) {
      const temp = query.requirements.thermal.operatingTemperature;
      if (temp.min !== undefined) {
        mongoQuery['properties.thermal.operatingTemperature.min'] = { $lte: temp.min };
      }
      if (temp.max !== undefined) {
        mongoQuery['properties.thermal.operatingTemperature.max'] = { $gte: temp.max };
      }
    }

    // Chemical compatibility
    if (query.requirements.chemical?.chemicalCompatibility) {
      mongoQuery['properties.chemical.chemicalCompatibility'] = {
        $in: query.requirements.chemical.chemicalCompatibility
      };
    }

    // Constraints
    if (query.constraints) {
      if (query.constraints.maxLeadTime) {
        mongoQuery['availability.leadTime'] = { $lte: query.constraints.maxLeadTime };
      }
      if (query.constraints.maxCost) {
        mongoQuery['availability.costIndex'] = { $lte: query.constraints.maxCost };
      }
      if (query.constraints.excludeMaterials) {
        mongoQuery.name = { $nin: query.constraints.excludeMaterials };
      }
    }

    return mongoQuery;
  }

  private async scoreMaterial(
    material: IMaterial, 
    query: MaterialQuery
  ): Promise<MaterialRecommendation> {
    const scores = {
      mechanicalMatch: this.calculateMechanicalMatch(material, query),
      thermalMatch: this.calculateThermalMatch(material, query),
      chemicalMatch: this.calculateChemicalMatch(material, query),
      sustainabilityScore: this.calculateSustainabilityScore(material),
      costScore: this.calculateCostScore(material),
      availabilityScore: this.calculateAvailabilityScore(material)
    };

    // Weighted overall score based on priorities
    const priorities = query.priorities || {};
    const weights = {
      performance: (priorities.performance || 5) / 10,
      sustainability: (priorities.sustainability || 5) / 10,
      cost: (priorities.cost || 5) / 10,
      availability: (priorities.availability || 5) / 10
    };

    const performanceScore = (scores.mechanicalMatch + scores.thermalMatch + scores.chemicalMatch) / 3;
    
    const overallScore = 
      performanceScore * weights.performance +
      scores.sustainabilityScore * weights.sustainability +
      scores.costScore * weights.cost +
      scores.availabilityScore * weights.availability;

    const risks = this.identifyRisks(material, query);
    const alternatives = await this.findAlternatives(material);

    return {
      material,
      score: overallScore,
      reasoning: '', // Will be filled by AI
      matchDetails: scores,
      risks,
      alternatives
    };
  }

  private calculateMechanicalMatch(material: IMaterial, query: MaterialQuery): number {
    let score = 1.0;
    const mech = query.requirements.mechanical;
    const matMech = material.properties.mechanical;

    if (mech?.tensileStrength?.min && matMech.tensileStrength) {
      if (matMech.tensileStrength < mech.tensileStrength.min) {
        score *= 0.5;
      }
    }

    if (mech?.yieldStrength?.min && matMech.yieldStrength) {
      if (matMech.yieldStrength < mech.yieldStrength.min) {
        score *= 0.5;
      }
    }

    return Math.max(0, Math.min(1, score));
  }

  private calculateThermalMatch(material: IMaterial, query: MaterialQuery): number {
    let score = 1.0;
    const thermal = query.requirements.thermal;
    const matThermal = material.properties.thermal;

    if (thermal?.operatingTemperature && matThermal.operatingTemperature) {
      const reqMin = thermal.operatingTemperature.min;
      const reqMax = thermal.operatingTemperature.max;
      const matMin = matThermal.operatingTemperature.min;
      const matMax = matThermal.operatingTemperature.max;

      if (reqMin !== undefined && matMin > reqMin) score *= 0.7;
      if (reqMax !== undefined && matMax < reqMax) score *= 0.7;
    }

    return Math.max(0, Math.min(1, score));
  }

  private calculateChemicalMatch(material: IMaterial, query: MaterialQuery): number {
    const chemical = query.requirements.chemical;
    if (!chemical) return 1.0;

    let score = 1.0;
    
    if (chemical.chemicalCompatibility && material.properties.chemical.chemicalCompatibility) {
      const matches = chemical.chemicalCompatibility.filter(req => 
        material.properties.chemical.chemicalCompatibility?.includes(req)
      );
      score = matches.length / chemical.chemicalCompatibility.length;
    }

    return Math.max(0, Math.min(1, score));
  }

  private calculateSustainabilityScore(material: IMaterial): number {
    let score = 0;
    
    if (material.sustainability.recyclable) score += 0.4;
    if (material.sustainability.recycledContent && material.sustainability.recycledContent > 0) {
      score += 0.3 * (material.sustainability.recycledContent / 100);
    }
    if (material.sustainability.carbonFootprint && material.sustainability.carbonFootprint < 10) {
      score += 0.3;
    }

    return Math.max(0, Math.min(1, score));
  }

  private calculateCostScore(material: IMaterial): number {
    // Lower cost index = higher score
    return Math.max(0, (10 - material.availability.costIndex) / 10);
  }

  private calculateAvailabilityScore(material: IMaterial): number {
    let score = 0;
    
    // Lead time score (lower is better)
    if (material.availability.leadTime <= 7) score += 0.5;
    else if (material.availability.leadTime <= 30) score += 0.3;
    else if (material.availability.leadTime <= 90) score += 0.1;

    // Supplier count
    if (material.availability.suppliers.length >= 5) score += 0.3;
    else if (material.availability.suppliers.length >= 2) score += 0.2;
    else score += 0.1;

    // Regional availability
    if (material.availability.regions.length >= 3) score += 0.2;
    else if (material.availability.regions.length >= 1) score += 0.1;

    return Math.max(0, Math.min(1, score));
  }

  private identifyRisks(material: IMaterial, query: MaterialQuery): string[] {
    const risks: string[] = [];

    if (material.availability.leadTime > 60) {
      risks.push('Long lead time may impact project schedule');
    }

    if (material.availability.costIndex > 7) {
      risks.push('High cost material - consider budget impact');
    }

    if (material.availability.suppliers.length < 2) {
      risks.push('Limited supplier base - supply chain risk');
    }

    if (query.conditions.includes('corrosive') && 
        material.properties.chemical.corrosionResistance === 'poor') {
      risks.push('Poor corrosion resistance in specified conditions');
    }

    return risks;
  }

  private async findAlternatives(material: IMaterial): Promise<string[]> {
    try {
      const alternatives = await Material.find({
        category: material.category,
        _id: { $ne: material._id }
      })
      .limit(3)
      .select('name')
      .lean();

      return alternatives.map(alt => alt.name);
    } catch (error) {
      logger.error('Error finding alternatives:', error);
      return [];
    }
  }

  private async generateAIReasoning(
    material: IMaterial, 
    query: MaterialQuery
  ): Promise<string> {
    try {
      const prompt = `
        Analyze why ${material.name} is recommended for a ${query.domain} application.
        
        Material Properties:
        - Tensile Strength: ${material.properties.mechanical.tensileStrength || 'N/A'} MPa
        - Operating Temperature: ${material.properties.thermal.operatingTemperature?.min || 'N/A'} to ${material.properties.thermal.operatingTemperature?.max || 'N/A'} °C
        - Corrosion Resistance: ${material.properties.chemical.corrosionResistance || 'N/A'}
        - Recyclable: ${material.sustainability.recyclable ? 'Yes' : 'No'}
        
        Requirements:
        - Domain: ${query.domain}
        - Conditions: ${query.conditions.join(', ')}
        
        Provide a concise technical explanation (2-3 sentences) of why this material is suitable.
      `;

      return await this.openAIService.generateReasoning(prompt);
    } catch (error) {
      logger.error('Error generating AI reasoning:', error);
      return 'Material selected based on technical specifications and application requirements.';
    }
  }

  async compareMaterials(materials: IMaterial[]): Promise<any> {
    const comparison = {
      materials: materials.map(m => ({
        name: m.name,
        category: m.category,
        properties: m.properties,
        sustainability: m.sustainability,
        availability: m.availability
      })),
      analysis: {
        strongest: this.findStrongestMaterial(materials),
        mostSustainable: this.findMostSustainable(materials),
        mostCostEffective: this.findMostCostEffective(materials),
        fastestDelivery: this.findFastestDelivery(materials)
      }
    };

    return comparison;
  }

  private findStrongestMaterial(materials: IMaterial[]): string {
    let strongest = materials[0];
    let maxStrength = strongest.properties.mechanical.tensileStrength || 0;

    for (const material of materials) {
      const strength = material.properties.mechanical.tensileStrength || 0;
      if (strength > maxStrength) {
        maxStrength = strength;
        strongest = material;
      }
    }

    return strongest.name;
  }

  private findMostSustainable(materials: IMaterial[]): string {
    let mostSustainable = materials[0];
    let maxScore = this.calculateSustainabilityScore(mostSustainable);

    for (const material of materials) {
      const score = this.calculateSustainabilityScore(material);
      if (score > maxScore) {
        maxScore = score;
        mostSustainable = material;
      }
    }

    return mostSustainable.name;
  }

  private findMostCostEffective(materials: IMaterial[]): string {
    let mostCostEffective = materials[0];
    let minCost = mostCostEffective.availability.costIndex;

    for (const material of materials) {
      if (material.availability.costIndex < minCost) {
        minCost = material.availability.costIndex;
        mostCostEffective = material;
      }
    }

    return mostCostEffective.name;
  }

  private findFastestDelivery(materials: IMaterial[]): string {
    let fastest = materials[0];
    let minLeadTime = fastest.availability.leadTime;

    for (const material of materials) {
      if (material.availability.leadTime < minLeadTime) {
        minLeadTime = material.availability.leadTime;
        fastest = material;
      }
    }

    return fastest.name;
  }

  async generateSustainabilityReport(): Promise<any> {
    try {
      const totalMaterials = await Material.countDocuments();
      const recyclableMaterials = await Material.countDocuments({ 'sustainability.recyclable': true });
      
      const avgCarbonFootprint = await Material.aggregate([
        { $match: { 'sustainability.carbonFootprint': { $exists: true } } },
        { $group: { _id: null, avg: { $avg: '$sustainability.carbonFootprint' } } }
      ]);

      const materialsByCategory = await Material.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      return {
        overview: {
          totalMaterials,
          recyclableMaterials,
          recyclablePercentage: (recyclableMaterials / totalMaterials) * 100,
          avgCarbonFootprint: avgCarbonFootprint[0]?.avg || 0
        },
        categoryBreakdown: materialsByCategory,
        recommendations: [
          'Prioritize materials with high recycled content',
          'Consider end-of-life treatment options',
          'Evaluate carbon footprint in material selection',
          'Choose suppliers with sustainability certifications'
        ]
      };
    } catch (error) {
      logger.error('Error generating sustainability report:', error);
      throw error;
    }
  }
}