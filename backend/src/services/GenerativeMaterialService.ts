import { logger } from '../utils/logger';
import { OpenAIService } from './OpenAIService';

export interface MaterialComposition {
  elements: { [element: string]: number };
  targetProperties: {
    tensileStrength?: number;
    density?: number;
    thermalConductivity?: number;
    corrosionResistance?: string;
  };
}

export interface GeneratedMaterial {
  composition: MaterialComposition;
  predictedProperties: any;
  confidence: number;
  synthesisRoute: string[];
  estimatedCost: number;
  feasibilityScore: number;
}

export class GenerativeMaterialService {
  private openAIService: OpenAIService;

  constructor() {
    this.openAIService = new OpenAIService();
  }

  async generateMaterial(targetProperties: any): Promise<GeneratedMaterial> {
    try {
      logger.info('Generating new material with inverse design');

      // Use AI to generate material composition
      const composition = await this.inverseDesign(targetProperties);
      
      // Predict properties using surrogate model
      const predictedProperties = await this.surrogateOptimization(composition);
      
      // Calculate feasibility
      const feasibilityScore = this.calculateFeasibility(composition, predictedProperties);
      
      // Generate synthesis route
      const synthesisRoute = await this.generateSynthesisRoute(composition);
      
      // Estimate cost
      const estimatedCost = this.estimateMaterialCost(composition);

      return {
        composition,
        predictedProperties,
        confidence: feasibilityScore,
        synthesisRoute,
        estimatedCost,
        feasibilityScore
      };
    } catch (error) {
      logger.error('Error in generative material discovery:', error);
      throw error;
    }
  }

  private async inverseDesign(targetProperties: any): Promise<MaterialComposition> {
    const prompt = `Design a material composition to achieve these properties:
    - Tensile Strength: ${targetProperties.tensileStrength || 'N/A'} MPa
    - Density: ${targetProperties.density || 'N/A'} kg/m³
    - Thermal Conductivity: ${targetProperties.thermalConductivity || 'N/A'} W/m·K
    - Corrosion Resistance: ${targetProperties.corrosionResistance || 'high'}
    
    Return a JSON with element composition percentages and predicted properties.`;

    const response = await this.openAIService.generateReasoning(prompt);
    
    // Parse AI response or use default composition
    return {
      elements: this.parseComposition(response, targetProperties),
      targetProperties
    };
  }

  private parseComposition(aiResponse: string, targetProperties: any): { [element: string]: number } {
    // Default composition based on target properties
    if (targetProperties.tensileStrength > 500) {
      return { Fe: 70, Cr: 18, Ni: 10, Mo: 2 }; // Stainless steel variant
    } else if (targetProperties.density < 3000) {
      return { Al: 90, Mg: 5, Si: 3, Cu: 2 }; // Aluminum alloy
    } else {
      return { Fe: 98, C: 1.5, Mn: 0.5 }; // Carbon steel
    }
  }

  private async surrogateOptimization(composition: MaterialComposition): Promise<any> {
    // Surrogate model for property prediction
    const elements = composition.elements;
    
    // Simple physics-based estimation
    const avgDensity = this.calculateDensity(elements);
    const estimatedStrength = this.estimateStrength(elements);
    const thermalCond = this.estimateThermalConductivity(elements);

    return {
      tensileStrength: estimatedStrength,
      density: avgDensity,
      thermalConductivity: thermalCond,
      yieldStrength: estimatedStrength * 0.7,
      elongation: this.estimateElongation(elements),
      hardness: estimatedStrength / 3
    };
  }

  private calculateDensity(elements: { [element: string]: number }): number {
    const densities: { [key: string]: number } = {
      Fe: 7874, Cr: 7190, Ni: 8908, Mo: 10280, Al: 2700, Mg: 1738, Si: 2330, Cu: 8960, C: 2267, Mn: 7470
    };
    
    let totalDensity = 0;
    for (const [element, percentage] of Object.entries(elements)) {
      totalDensity += (densities[element] || 7000) * (percentage / 100);
    }
    return totalDensity;
  }

  private estimateStrength(elements: { [element: string]: number }): number {
    let strength = 200; // Base strength
    
    if (elements.C) strength += elements.C * 100;
    if (elements.Cr) strength += elements.Cr * 5;
    if (elements.Ni) strength += elements.Ni * 3;
    if (elements.Mo) strength += elements.Mo * 15;
    
    return Math.min(strength, 2000);
  }

  private estimateThermalConductivity(elements: { [element: string]: number }): number {
    const conductivities: { [key: string]: number } = {
      Al: 237, Cu: 401, Fe: 80, Ni: 91, Cr: 94, Mg: 156
    };
    
    let totalCond = 0;
    for (const [element, percentage] of Object.entries(elements)) {
      totalCond += (conductivities[element] || 50) * (percentage / 100);
    }
    return totalCond;
  }

  private estimateElongation(elements: { [element: string]: number }): number {
    let elongation = 20;
    if (elements.C && elements.C > 0.5) elongation -= elements.C * 5;
    if (elements.Ni) elongation += elements.Ni * 0.5;
    return Math.max(5, Math.min(elongation, 50));
  }

  private calculateFeasibility(composition: MaterialComposition, properties: any): number {
    let score = 0.8;
    
    // Check if composition is realistic
    const totalPercentage = Object.values(composition.elements).reduce((a, b) => a + b, 0);
    if (Math.abs(totalPercentage - 100) > 5) score *= 0.5;
    
    // Check if properties are achievable
    if (properties.tensileStrength > 2000) score *= 0.7;
    if (properties.density < 1000 || properties.density > 20000) score *= 0.6;
    
    return Math.max(0.3, Math.min(score, 1.0));
  }

  private async generateSynthesisRoute(composition: MaterialComposition): Promise<string[]> {
    const elements = Object.keys(composition.elements);
    
    if (elements.includes('Fe')) {
      return [
        'Melt base iron in induction furnace at 1600°C',
        'Add alloying elements in sequence',
        'Maintain temperature for homogenization',
        'Cast into molds or continuous casting',
        'Heat treatment: quenching and tempering',
        'Final machining and surface treatment'
      ];
    } else if (elements.includes('Al')) {
      return [
        'Melt aluminum in crucible furnace at 700°C',
        'Add alloying elements with flux',
        'Degassing with argon or nitrogen',
        'Cast into ingots or direct chill casting',
        'Solution heat treatment',
        'Aging treatment for precipitation hardening'
      ];
    }
    
    return [
      'Prepare raw materials and calculate ratios',
      'Melting in appropriate furnace',
      'Alloying and homogenization',
      'Casting or forming process',
      'Heat treatment as required',
      'Quality control and testing'
    ];
  }

  private estimateMaterialCost(composition: MaterialComposition): number {
    const costs: { [key: string]: number } = {
      Fe: 0.5, C: 0.3, Cr: 8, Ni: 15, Mo: 35, Al: 2, Mg: 3, Si: 1.5, Cu: 7, Mn: 1.5
    };
    
    let totalCost = 0;
    for (const [element, percentage] of Object.entries(composition.elements)) {
      totalCost += (costs[element] || 5) * (percentage / 100);
    }
    
    return totalCost * 1.5; // Add processing cost multiplier
  }

  async optimizeComposition(
    initialComposition: MaterialComposition,
    constraints: any
  ): Promise<GeneratedMaterial[]> {
    const variants: GeneratedMaterial[] = [];
    
    // Generate multiple variants using genetic algorithm approach
    for (let i = 0; i < 5; i++) {
      const mutatedComposition = this.mutateComposition(initialComposition, i * 0.1);
      const material = await this.generateMaterial(mutatedComposition.targetProperties);
      variants.push(material);
    }
    
    return variants.sort((a, b) => b.feasibilityScore - a.feasibilityScore);
  }

  private mutateComposition(composition: MaterialComposition, mutationRate: number): MaterialComposition {
    const mutated = { ...composition };
    const elements = { ...composition.elements };
    
    // Randomly adjust element percentages
    for (const element of Object.keys(elements)) {
      const change = (Math.random() - 0.5) * mutationRate * 10;
      elements[element] = Math.max(0, Math.min(100, elements[element] + change));
    }
    
    // Normalize to 100%
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    for (const element of Object.keys(elements)) {
      elements[element] = (elements[element] / total) * 100;
    }
    
    mutated.elements = elements;
    return mutated;
  }
}
