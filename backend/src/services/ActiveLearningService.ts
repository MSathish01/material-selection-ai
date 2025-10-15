import { logger } from '../utils/logger';
import { IMaterial } from '../models/Material';

export interface ExperimentSuggestion {
  materialComposition: any;
  testConditions: any;
  expectedValue: number;
  uncertainty: number;
  acquisitionScore: number;
  rationale: string;
}

export interface BayesianModel {
  mean: number[];
  covariance: number[][];
  observations: { input: number[]; output: number }[];
}

export class ActiveLearningService {
  private models: Map<string, BayesianModel> = new Map();

  async suggestNextExperiment(
    property: string,
    existingData: any[],
    constraints?: any
  ): Promise<ExperimentSuggestion> {
    logger.info(`Suggesting next experiment for property: ${property}`);

    // Build or update Bayesian model
    const model = this.buildBayesianModel(property, existingData);
    this.models.set(property, model);

    // Generate candidate experiments
    const candidates = this.generateCandidates(constraints);

    // Calculate acquisition function for each candidate
    const scoredCandidates = candidates.map(candidate => ({
      candidate,
      score: this.calculateAcquisitionFunction(candidate, model)
    }));

    // Select best candidate
    const best = scoredCandidates.reduce((prev, curr) => 
      curr.score > prev.score ? curr : prev
    );

    return this.formatSuggestion(best.candidate, best.score, model);
  }

  private buildBayesianModel(property: string, data: any[]): BayesianModel {
    // Simple Gaussian Process model
    const observations = data.map(d => ({
      input: this.extractFeatures(d),
      output: d[property] || 0
    }));

    // Calculate mean and covariance
    const mean = this.calculateMean(observations);
    const covariance = this.calculateCovariance(observations);

    return { mean, covariance, observations };
  }

  private extractFeatures(data: any): number[] {
    // Extract relevant features from material data
    const features = [];
    
    if (data.composition) {
      features.push(data.composition.Fe || 0);
      features.push(data.composition.C || 0);
      features.push(data.composition.Cr || 0);
      features.push(data.composition.Ni || 0);
    } else {
      features.push(0, 0, 0, 0);
    }
    
    if (data.processingTemp) features.push(data.processingTemp);
    if (data.coolingRate) features.push(data.coolingRate);

    return features;
  }

  private calculateMean(observations: any[]): number[] {
    if (observations.length === 0) return [0, 0, 0, 0];

    const featureCount = observations[0].input.length;
    const mean = new Array(featureCount).fill(0);

    observations.forEach(obs => {
      obs.input.forEach((val: number, idx: number) => {
        mean[idx] += val;
      });
    });

    return mean.map(sum => sum / observations.length);
  }

  private calculateCovariance(observations: any[]): number[][] {
    if (observations.length === 0) return [[1, 0], [0, 1]];

    const mean = this.calculateMean(observations);
    const n = mean.length;
    const cov = Array(n).fill(0).map(() => Array(n).fill(0));

    observations.forEach(obs => {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          cov[i][j] += (obs.input[i] - mean[i]) * (obs.input[j] - mean[j]);
        }
      }
    });

    // Normalize
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        cov[i][j] /= observations.length;
      }
    }

    return cov;
  }

  private generateCandidates(constraints?: any): any[] {
    const candidates = [];
    const numCandidates = 20;

    for (let i = 0; i < numCandidates; i++) {
      const candidate = {
        composition: {
          Fe: this.randomInRange(60, 90, constraints?.Fe),
          C: this.randomInRange(0.1, 2.0, constraints?.C),
          Cr: this.randomInRange(0, 20, constraints?.Cr),
          Ni: this.randomInRange(0, 15, constraints?.Ni)
        },
        processingTemp: this.randomInRange(800, 1200, constraints?.processingTemp),
        coolingRate: this.randomInRange(1, 100, constraints?.coolingRate)
      };

      candidates.push(candidate);
    }

    return candidates;
  }

  private randomInRange(min: number, max: number, constraint?: { min?: number; max?: number }): number {
    const actualMin = constraint?.min !== undefined ? Math.max(min, constraint.min) : min;
    const actualMax = constraint?.max !== undefined ? Math.min(max, constraint.max) : max;
    return actualMin + Math.random() * (actualMax - actualMin);
  }

  private calculateAcquisitionFunction(candidate: any, model: BayesianModel): number {
    // Expected Improvement (EI) acquisition function
    const features = this.extractFeatures(candidate);
    
    // Predict mean and variance
    const prediction = this.predict(features, model);
    const mean = prediction.mean;
    const variance = prediction.variance;

    // Calculate expected improvement
    if (model.observations.length === 0) {
      return variance; // Pure exploration
    }

    const bestObserved = Math.max(...model.observations.map(o => o.output));
    const improvement = mean - bestObserved;
    const z = improvement / Math.sqrt(variance + 1e-9);

    // EI = improvement * Φ(z) + σ * φ(z)
    const ei = improvement * this.normalCDF(z) + Math.sqrt(variance) * this.normalPDF(z);

    return ei;
  }

  private predict(features: number[], model: BayesianModel): { mean: number; variance: number } {
    if (model.observations.length === 0) {
      return { mean: 0, variance: 1 };
    }

    // Simple kernel-based prediction
    let weightedSum = 0;
    let totalWeight = 0;

    model.observations.forEach(obs => {
      const distance = this.euclideanDistance(features, obs.input);
      const weight = Math.exp(-distance / 10); // RBF kernel
      weightedSum += weight * obs.output;
      totalWeight += weight;
    });

    const mean = totalWeight > 0 ? weightedSum / totalWeight : 0;
    const variance = totalWeight > 0 ? 1 / totalWeight : 1;

    return { mean, variance };
  }

  private euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(
      a.reduce((sum, val, idx) => sum + Math.pow(val - (b[idx] || 0), 2), 0)
    );
  }

  private normalCDF(x: number): number {
    // Approximation of standard normal CDF
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  private normalPDF(x: number): number {
    // Standard normal PDF
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  }

  private erf(x: number): number {
    // Approximation of error function
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  private formatSuggestion(candidate: any, score: number, model: BayesianModel): ExperimentSuggestion {
    const prediction = this.predict(this.extractFeatures(candidate), model);

    return {
      materialComposition: candidate.composition,
      testConditions: {
        processingTemperature: candidate.processingTemp,
        coolingRate: candidate.coolingRate
      },
      expectedValue: prediction.mean,
      uncertainty: Math.sqrt(prediction.variance),
      acquisitionScore: score,
      rationale: this.generateRationale(candidate, prediction, score)
    };
  }

  private generateRationale(candidate: any, prediction: any, score: number): string {
    const uncertainty = Math.sqrt(prediction.variance);
    
    if (uncertainty > 0.5) {
      return `High uncertainty region - this experiment will provide valuable information about unexplored parameter space. Expected value: ${prediction.mean.toFixed(2)}, Uncertainty: ${uncertainty.toFixed(2)}`;
    } else if (prediction.mean > 500) {
      return `Promising composition with high expected performance (${prediction.mean.toFixed(2)}). Low uncertainty (${uncertainty.toFixed(2)}) suggests reliable prediction.`;
    } else {
      return `Balanced exploration-exploitation trade-off. Acquisition score: ${score.toFixed(3)}. This experiment optimizes information gain.`;
    }
  }

  async optimizeExperimentalCampaign(
    property: string,
    budget: number,
    existingData: any[]
  ): Promise<ExperimentSuggestion[]> {
    logger.info(`Optimizing experimental campaign with budget: ${budget}`);

    const suggestions: ExperimentSuggestion[] = [];
    let currentData = [...existingData];

    for (let i = 0; i < budget; i++) {
      const suggestion = await this.suggestNextExperiment(property, currentData);
      suggestions.push(suggestion);

      // Simulate adding this experiment to the dataset
      currentData.push({
        composition: suggestion.materialComposition,
        [property]: suggestion.expectedValue
      });
    }

    return suggestions;
  }

  async analyzeDataGaps(materials: IMaterial[]): Promise<any> {
    const gaps = {
      missingProperties: [] as string[],
      lowDataRegions: [] as any[],
      recommendations: [] as string[]
    };

    // Analyze property coverage
    const propertyCount: { [key: string]: number } = {};
    
    materials.forEach(material => {
      if (!material.properties.mechanical.tensileStrength) {
        propertyCount['tensileStrength'] = (propertyCount['tensileStrength'] || 0) + 1;
      }
      // Note: thermalConductivity not in base model, skip for now
      // Future: Add thermalConductivity to Material model
    });

    // Identify gaps
    for (const [prop, count] of Object.entries(propertyCount)) {
      if (count > materials.length * 0.3) {
        gaps.missingProperties.push(prop);
        gaps.recommendations.push(
          `${count} materials missing ${prop} data - prioritize testing for these materials`
        );
      }
    }

    return gaps;
  }
}
