import { IMaterial } from '../models/Material';
import { logger } from '../utils/logger';

export interface OptimizationObjective {
  name: string;
  weight: number;
  minimize: boolean; // true for cost, false for performance
}

export interface ParetoSolution {
  material: IMaterial;
  objectives: { [key: string]: number };
  dominationCount: number;
  rank: number;
  crowdingDistance: number;
}

export class MultiObjectiveOptimizationService {
  async optimizeMaterials(
    materials: IMaterial[],
    objectives: OptimizationObjective[]
  ): Promise<ParetoSolution[]> {
    logger.info('Starting multi-objective optimization');

    // Calculate objective values for each material
    const solutions = materials.map(material => this.evaluateMaterial(material, objectives));

    // Perform non-dominated sorting (NSGA-II)
    const rankedSolutions = this.nonDominatedSort(solutions);

    // Calculate crowding distance
    this.calculateCrowdingDistance(rankedSolutions);

    return rankedSolutions.sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return b.crowdingDistance - a.crowdingDistance;
    });
  }

  private evaluateMaterial(material: IMaterial, objectives: OptimizationObjective[]): ParetoSolution {
    const objectiveValues: { [key: string]: number } = {};

    objectives.forEach(obj => {
      switch (obj.name) {
        case 'performance':
          objectiveValues.performance = this.calculatePerformanceScore(material);
          break;
        case 'cost':
          objectiveValues.cost = material.availability.costIndex;
          break;
        case 'sustainability':
          objectiveValues.sustainability = this.calculateSustainabilityScore(material);
          break;
        case 'availability':
          objectiveValues.availability = this.calculateAvailabilityScore(material);
          break;
        case 'manufacturability':
          objectiveValues.manufacturability = this.calculateManufacturabilityScore(material);
          break;
        case 'reliability':
          objectiveValues.reliability = this.calculateReliabilityScore(material);
          break;
      }
    });

    return {
      material,
      objectives: objectiveValues,
      dominationCount: 0,
      rank: 0,
      crowdingDistance: 0
    };
  }

  private calculatePerformanceScore(material: IMaterial): number {
    let score = 0;
    
    // Mechanical performance
    if (material.properties.mechanical.tensileStrength) {
      score += material.properties.mechanical.tensileStrength / 10;
    }
    if (material.properties.mechanical.yieldStrength) {
      score += material.properties.mechanical.yieldStrength / 10;
    }
    if (material.properties.mechanical.hardness) {
      score += material.properties.mechanical.hardness / 5;
    }

    // Thermal performance (thermal conductivity not in base model, skip for now)
    // Future: Add thermalConductivity to Material model

    return score;
  }

  private calculateSustainabilityScore(material: IMaterial): number {
    let score = 0;
    
    if (material.sustainability.recyclable) score += 30;
    if (material.sustainability.recycledContent) {
      score += material.sustainability.recycledContent * 0.5;
    }
    if (material.sustainability.carbonFootprint) {
      score += Math.max(0, 30 - material.sustainability.carbonFootprint);
    }
    if (material.sustainability.certifications?.length) {
      score += material.sustainability.certifications.length * 5;
    }

    return score;
  }

  private calculateAvailabilityScore(material: IMaterial): number {
    let score = 0;
    
    // Lead time (lower is better)
    score += Math.max(0, 50 - material.availability.leadTime);
    
    // Supplier count
    score += material.availability.suppliers.length * 5;
    
    // Regional availability
    score += material.availability.regions.length * 10;

    return score;
  }

  private calculateManufacturabilityScore(material: IMaterial): number {
    let score = 50; // Base score

    if (material.processability) {
      // Check string values for processability
      if (material.processability.machining === 'excellent' || material.processability.machining === 'good') score += 15;
      if (material.processability.welding === 'excellent' || material.processability.welding === 'good') score += 15;
      if (material.processability.forming === 'excellent' || material.processability.forming === 'good') score += 10;
    }

    return score;
  }

  private calculateReliabilityScore(material: IMaterial): number {
    let score = 60; // Base reliability

    // Standards compliance increases reliability
    if (material.standards?.length) {
      score += material.standards.length * 5;
    }

    // Corrosion resistance
    if (material.properties.chemical.corrosionResistance === 'excellent') score += 20;
    else if (material.properties.chemical.corrosionResistance === 'good') score += 10;

    return Math.min(100, score);
  }

  private nonDominatedSort(solutions: ParetoSolution[]): ParetoSolution[] {
    const fronts: ParetoSolution[][] = [[]];
    
    // Calculate domination for each solution
    for (let i = 0; i < solutions.length; i++) {
      solutions[i].dominationCount = 0;
      const dominatedSolutions: number[] = [];

      for (let j = 0; j < solutions.length; j++) {
        if (i === j) continue;

        if (this.dominates(solutions[i], solutions[j])) {
          dominatedSolutions.push(j);
        } else if (this.dominates(solutions[j], solutions[i])) {
          solutions[i].dominationCount++;
        }
      }

      if (solutions[i].dominationCount === 0) {
        solutions[i].rank = 1;
        fronts[0].push(solutions[i]);
      }
    }

    // Build subsequent fronts
    let currentRank = 1;
    while (fronts[currentRank - 1].length > 0) {
      const nextFront: ParetoSolution[] = [];
      
      for (const solution of fronts[currentRank - 1]) {
        const index = solutions.indexOf(solution);
        // Find dominated solutions and reduce their domination count
        for (let j = 0; j < solutions.length; j++) {
          if (this.dominates(solution, solutions[j])) {
            solutions[j].dominationCount--;
            if (solutions[j].dominationCount === 0) {
              solutions[j].rank = currentRank + 1;
              nextFront.push(solutions[j]);
            }
          }
        }
      }

      if (nextFront.length > 0) {
        fronts.push(nextFront);
        currentRank++;
      } else {
        break;
      }
    }

    return solutions;
  }

  private dominates(sol1: ParetoSolution, sol2: ParetoSolution): boolean {
    let betterInOne = false;
    
    for (const key of Object.keys(sol1.objectives)) {
      const val1 = sol1.objectives[key];
      const val2 = sol2.objectives[key];

      // For cost, lower is better; for others, higher is better
      if (key === 'cost') {
        if (val1 > val2) return false;
        if (val1 < val2) betterInOne = true;
      } else {
        if (val1 < val2) return false;
        if (val1 > val2) betterInOne = true;
      }
    }

    return betterInOne;
  }

  private calculateCrowdingDistance(solutions: ParetoSolution[]): void {
    if (solutions.length === 0) return;

    const objectives = Object.keys(solutions[0].objectives);
    
    // Initialize crowding distance
    solutions.forEach(sol => sol.crowdingDistance = 0);

    // Calculate for each objective
    for (const objective of objectives) {
      // Sort by objective value
      solutions.sort((a, b) => a.objectives[objective] - b.objectives[objective]);

      // Boundary solutions get infinite distance
      solutions[0].crowdingDistance = Infinity;
      solutions[solutions.length - 1].crowdingDistance = Infinity;

      const range = solutions[solutions.length - 1].objectives[objective] - solutions[0].objectives[objective];
      
      if (range === 0) continue;

      // Calculate crowding distance for intermediate solutions
      for (let i = 1; i < solutions.length - 1; i++) {
        const distance = (solutions[i + 1].objectives[objective] - solutions[i - 1].objectives[objective]) / range;
        solutions[i].crowdingDistance += distance;
      }
    }
  }

  async generateParetoFront(solutions: ParetoSolution[]): Promise<any> {
    const paretoFront = solutions.filter(sol => sol.rank === 1);

    return {
      totalSolutions: solutions.length,
      paretoOptimalCount: paretoFront.length,
      paretoFront: paretoFront.map(sol => ({
        materialName: sol.material.name,
        objectives: sol.objectives,
        crowdingDistance: sol.crowdingDistance
      })),
      tradeoffAnalysis: this.analyzeTradeoffs(paretoFront),
      recommendations: this.generateRecommendations(paretoFront)
    };
  }

  private analyzeTradeoffs(paretoFront: ParetoSolution[]): any {
    if (paretoFront.length === 0) return {};

    const analysis: any = {};
    const objectives = Object.keys(paretoFront[0].objectives);

    for (let i = 0; i < objectives.length; i++) {
      for (let j = i + 1; j < objectives.length; j++) {
        const obj1 = objectives[i];
        const obj2 = objectives[j];
        
        const correlation = this.calculateCorrelation(
          paretoFront.map(s => s.objectives[obj1]),
          paretoFront.map(s => s.objectives[obj2])
        );

        analysis[`${obj1}_vs_${obj2}`] = {
          correlation: correlation.toFixed(3),
          relationship: correlation > 0.5 ? 'positive' : correlation < -0.5 ? 'negative' : 'weak'
        };
      }
    }

    return analysis;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private generateRecommendations(paretoFront: ParetoSolution[]): string[] {
    const recommendations = [];

    if (paretoFront.length === 0) {
      return ['No Pareto-optimal solutions found. Consider relaxing constraints.'];
    }

    // Find best in each objective
    const objectives = Object.keys(paretoFront[0].objectives);
    
    for (const obj of objectives) {
      const best = paretoFront.reduce((prev, curr) => 
        (obj === 'cost' ? 
          (curr.objectives[obj] < prev.objectives[obj] ? curr : prev) :
          (curr.objectives[obj] > prev.objectives[obj] ? curr : prev)
        )
      );
      
      recommendations.push(
        `For best ${obj}: ${best.material.name} (${obj} score: ${best.objectives[obj].toFixed(2)})`
      );
    }

    // Balanced solution
    const balanced = this.findBalancedSolution(paretoFront);
    if (balanced) {
      recommendations.push(
        `Balanced solution: ${balanced.material.name} (crowding distance: ${balanced.crowdingDistance.toFixed(2)})`
      );
    }

    return recommendations;
  }

  private findBalancedSolution(paretoFront: ParetoSolution[]): ParetoSolution | null {
    if (paretoFront.length === 0) return null;

    // Find solution with highest crowding distance (most diverse)
    return paretoFront.reduce((prev, curr) => 
      curr.crowdingDistance > prev.crowdingDistance ? curr : prev
    );
  }
}
