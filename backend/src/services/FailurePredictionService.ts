import { IMaterial } from '../models/Material';
import { logger } from '../utils/logger';

export interface FailureMode {
  mode: string;
  probability: number;
  severity: number;
  detectability: number;
  rpn: number; // Risk Priority Number
  causes: string[];
  effects: string[];
  preventiveMeasures: string[];
}

export interface StressAnalysis {
  maxStress: number;
  yieldMargin: number;
  fatigueLife: number;
  safetyFactor: number;
  criticalLocations: string[];
  recommendations: string[];
}

export interface FailurePrediction {
  material: string;
  operatingConditions: any;
  failureModes: FailureMode[];
  stressAnalysis: StressAnalysis;
  predictedLifetime: number;
  maintenanceSchedule: any[];
  overallRisk: string;
}

export class FailurePredictionService {
  async predictFailure(
    material: IMaterial,
    operatingConditions: any
  ): Promise<FailurePrediction> {
    logger.info(`Predicting failure modes for: ${material.name}`);

    const failureModes = this.identifyFailureModes(material, operatingConditions);
    const stressAnalysis = this.performStressAnalysis(material, operatingConditions);
    const predictedLifetime = this.calculateLifetime(material, operatingConditions, failureModes);
    const maintenanceSchedule = this.generateMaintenanceSchedule(failureModes, predictedLifetime);
    const overallRisk = this.assessOverallRisk(failureModes);

    return {
      material: material.name,
      operatingConditions,
      failureModes,
      stressAnalysis,
      predictedLifetime,
      maintenanceSchedule,
      overallRisk
    };
  }

  private identifyFailureModes(material: IMaterial, conditions: any): FailureMode[] {
    const modes: FailureMode[] = [];

    // Corrosion failure
    if (conditions.corrosiveEnvironment || conditions.humidity > 70) {
      const corrosionResistance = material.properties.chemical.corrosionResistance;
      let probability = 0.3;
      
      if (corrosionResistance === 'poor') probability = 0.8;
      else if (corrosionResistance === 'fair') probability = 0.5;
      else if (corrosionResistance === 'good') probability = 0.2;
      else if (corrosionResistance === 'excellent') probability = 0.05;

      modes.push({
        mode: 'Corrosion Failure',
        probability,
        severity: 8,
        detectability: 6,
        rpn: probability * 10 * 8 * 6,
        causes: [
          'Exposure to corrosive environment',
          'Inadequate protective coating',
          'Galvanic corrosion',
          'Stress corrosion cracking'
        ],
        effects: [
          'Material degradation',
          'Loss of structural integrity',
          'Potential catastrophic failure',
          'Contamination of surrounding systems'
        ],
        preventiveMeasures: [
          'Apply corrosion-resistant coating',
          'Regular inspection and maintenance',
          'Cathodic protection system',
          'Environmental control (humidity, pH)'
        ]
      });
    }

    // Fatigue failure
    if (conditions.cyclicLoading || conditions.vibration) {
      const tensileStrength = material.properties.mechanical.tensileStrength || 500;
      const appliedStress = conditions.maxStress || 200;
      const stressRatio = appliedStress / tensileStrength;

      modes.push({
        mode: 'Fatigue Failure',
        probability: Math.min(0.9, stressRatio * 1.5),
        severity: 9,
        detectability: 7,
        rpn: Math.min(0.9, stressRatio * 1.5) * 10 * 9 * 7,
        causes: [
          'Cyclic loading',
          'Stress concentrations',
          'Surface defects',
          'Microstructural discontinuities'
        ],
        effects: [
          'Crack initiation and propagation',
          'Sudden catastrophic failure',
          'Reduced service life',
          'Safety hazards'
        ],
        preventiveMeasures: [
          'Reduce stress concentrations',
          'Surface treatment (shot peening)',
          'Regular NDT inspections',
          'Design for fatigue resistance'
        ]
      });
    }

    // Creep failure
    if (conditions.temperature > 400 && conditions.sustainedLoad) {
      const operatingTemp = conditions.temperature;
      const meltingPoint = 1500; // Default melting point, should be added to model
      const tempRatio = operatingTemp / meltingPoint;

      if (tempRatio > 0.4) {
        modes.push({
          mode: 'Creep Failure',
          probability: Math.min(0.8, tempRatio * 2),
          severity: 8,
          detectability: 5,
          rpn: Math.min(0.8, tempRatio * 2) * 10 * 8 * 5,
          causes: [
            'High temperature operation',
            'Sustained loading',
            'Grain boundary sliding',
            'Diffusion processes'
          ],
          effects: [
            'Progressive deformation',
            'Dimensional changes',
            'Loss of functionality',
            'Eventual rupture'
          ],
          preventiveMeasures: [
            'Use creep-resistant alloys',
            'Reduce operating temperature',
            'Periodic dimensional checks',
            'Stress relief treatments'
          ]
        });
      }
    }

    // Brittle fracture
    if (conditions.temperature < -20 || conditions.impactLoading) {
      const operatingTemp = conditions.temperature || 25;
      const ductileBrittleTransition = material.properties.thermal.operatingTemperature?.min || -40;

      if (operatingTemp < ductileBrittleTransition + 20) {
        modes.push({
          mode: 'Brittle Fracture',
          probability: 0.4,
          severity: 10,
          detectability: 9,
          rpn: 0.4 * 10 * 10 * 9,
          causes: [
            'Low temperature operation',
            'Impact loading',
            'Stress concentrations',
            'Material defects'
          ],
          effects: [
            'Sudden catastrophic failure',
            'No warning signs',
            'Complete structural collapse',
            'Safety critical'
          ],
          preventiveMeasures: [
            'Use materials with low DBTT',
            'Preheat before operation',
            'Eliminate stress concentrations',
            'Impact testing and qualification'
          ]
        });
      }
    }

    // Wear failure
    if (conditions.abrasiveEnvironment || conditions.slidingContact) {
      const hardness = material.properties.mechanical.hardness || 200;
      
      modes.push({
        mode: 'Wear Failure',
        probability: 0.6,
        severity: 6,
        detectability: 4,
        rpn: 0.6 * 10 * 6 * 4,
        causes: [
          'Abrasive particles',
          'Sliding/rolling contact',
          'Inadequate lubrication',
          'Surface roughness'
        ],
        effects: [
          'Material loss',
          'Dimensional changes',
          'Increased clearances',
          'Performance degradation'
        ],
        preventiveMeasures: [
          'Surface hardening treatments',
          'Proper lubrication',
          'Wear-resistant coatings',
          'Regular inspection and replacement'
        ]
      });
    }

    // Thermal fatigue
    if (conditions.thermalCycling) {
      modes.push({
        mode: 'Thermal Fatigue',
        probability: 0.5,
        severity: 7,
        detectability: 6,
        rpn: 0.5 * 10 * 7 * 6,
        causes: [
          'Thermal cycling',
          'Thermal expansion mismatch',
          'Constrained thermal expansion',
          'Temperature gradients'
        ],
        effects: [
          'Surface cracking',
          'Spalling',
          'Loss of protective coatings',
          'Reduced thermal efficiency'
        ],
        preventiveMeasures: [
          'Use materials with low thermal expansion',
          'Thermal barrier coatings',
          'Controlled heating/cooling rates',
          'Expansion joints'
        ]
      });
    }

    // Sort by RPN (highest risk first)
    return modes.sort((a, b) => b.rpn - a.rpn);
  }

  private performStressAnalysis(material: IMaterial, conditions: any): StressAnalysis {
    const yieldStrength = material.properties.mechanical.yieldStrength || 
                         (material.properties.mechanical.tensileStrength || 500) * 0.7;
    const appliedStress = conditions.maxStress || 100;
    
    const safetyFactor = yieldStrength / appliedStress;
    const yieldMargin = ((yieldStrength - appliedStress) / yieldStrength) * 100;

    // Estimate fatigue life using simplified S-N curve
    const fatigueLife = this.estimateFatigueLife(material, appliedStress);

    const criticalLocations = this.identifyCriticalLocations(conditions);
    const recommendations = this.generateStressRecommendations(safetyFactor, yieldMargin);

    return {
      maxStress: appliedStress,
      yieldMargin,
      fatigueLife,
      safetyFactor,
      criticalLocations,
      recommendations
    };
  }

  private estimateFatigueLife(material: IMaterial, stress: number): number {
    const tensileStrength = material.properties.mechanical.tensileStrength || 500;
    const enduranceLimit = tensileStrength * 0.5; // Simplified

    if (stress < enduranceLimit) {
      return Infinity; // Infinite life
    }

    // Basquin's equation: N = (Sf / S)^b where b ≈ -0.1
    const cycles = Math.pow(tensileStrength / stress, 10);
    return Math.round(cycles);
  }

  private identifyCriticalLocations(conditions: any): string[] {
    const locations = [];

    if (conditions.stressConcentrations) {
      locations.push('Geometric discontinuities (holes, notches, fillets)');
    }
    if (conditions.weldedJoints) {
      locations.push('Welded joints and heat-affected zones');
    }
    if (conditions.boltedConnections) {
      locations.push('Bolted connections and fastener holes');
    }
    if (conditions.surfaceDefects) {
      locations.push('Surface defects and machining marks');
    }

    if (locations.length === 0) {
      locations.push('Areas of maximum stress');
      locations.push('Material interfaces');
    }

    return locations;
  }

  private generateStressRecommendations(safetyFactor: number, yieldMargin: number): string[] {
    const recommendations = [];

    if (safetyFactor < 1.5) {
      recommendations.push('CRITICAL: Safety factor below recommended minimum - reduce loading or upgrade material');
    } else if (safetyFactor < 2.0) {
      recommendations.push('WARNING: Low safety factor - consider design modifications');
    } else if (safetyFactor > 5.0) {
      recommendations.push('Over-designed: Consider cost optimization with lighter material');
    }

    if (yieldMargin < 20) {
      recommendations.push('Implement stress monitoring system');
      recommendations.push('Conduct regular structural inspections');
    }

    recommendations.push('Perform finite element analysis for detailed stress distribution');
    recommendations.push('Consider fatigue testing for critical applications');

    return recommendations;
  }

  private calculateLifetime(
    material: IMaterial,
    conditions: any,
    failureModes: FailureMode[]
  ): number {
    let baseLifetime = 20; // years

    // Reduce lifetime based on failure mode probabilities
    failureModes.forEach(mode => {
      baseLifetime *= (1 - mode.probability * 0.3);
    });

    // Temperature effects
    if (conditions.temperature > 200) {
      baseLifetime *= 0.7;
    }
    if (conditions.temperature < -50) {
      baseLifetime *= 0.8;
    }

    // Corrosion effects
    if (conditions.corrosiveEnvironment) {
      const resistance = material.properties.chemical.corrosionResistance;
      if (resistance === 'poor') baseLifetime *= 0.3;
      else if (resistance === 'fair') baseLifetime *= 0.6;
      else if (resistance === 'good') baseLifetime *= 0.9;
    }

    // Cyclic loading effects
    if (conditions.cyclicLoading) {
      baseLifetime *= 0.6;
    }

    return Math.max(1, Math.round(baseLifetime * 10) / 10);
  }

  private generateMaintenanceSchedule(failureModes: FailureMode[], lifetime: number): any[] {
    const schedule = [];
    const now = new Date();

    // Initial inspection
    schedule.push({
      type: 'Initial Inspection',
      interval: 'After installation',
      activities: ['Baseline measurements', 'Visual inspection', 'Documentation'],
      priority: 'High'
    });

    // Regular inspections based on failure modes
    if (failureModes.some(m => m.mode.includes('Corrosion'))) {
      schedule.push({
        type: 'Corrosion Inspection',
        interval: 'Every 6 months',
        activities: ['Visual inspection', 'Thickness measurements', 'Coating condition check'],
        priority: 'High'
      });
    }

    if (failureModes.some(m => m.mode.includes('Fatigue'))) {
      schedule.push({
        type: 'Fatigue Assessment',
        interval: 'Annually',
        activities: ['NDT inspection', 'Crack detection', 'Stress analysis'],
        priority: 'Critical'
      });
    }

    if (failureModes.some(m => m.mode.includes('Wear'))) {
      schedule.push({
        type: 'Wear Monitoring',
        interval: 'Every 3 months',
        activities: ['Dimensional checks', 'Surface condition', 'Lubrication check'],
        priority: 'Medium'
      });
    }

    // Major overhaul
    schedule.push({
      type: 'Major Overhaul',
      interval: `Every ${Math.max(1, Math.floor(lifetime / 3))} years`,
      activities: ['Complete disassembly', 'Comprehensive testing', 'Component replacement'],
      priority: 'High'
    });

    return schedule;
  }

  private assessOverallRisk(failureModes: FailureMode[]): string {
    if (failureModes.length === 0) return 'Low';

    const maxRPN = Math.max(...failureModes.map(m => m.rpn));
    const avgProbability = failureModes.reduce((sum, m) => sum + m.probability, 0) / failureModes.length;

    if (maxRPN > 500 || avgProbability > 0.7) return 'Critical';
    if (maxRPN > 300 || avgProbability > 0.5) return 'High';
    if (maxRPN > 150 || avgProbability > 0.3) return 'Medium';
    return 'Low';
  }

  async simulateFailureScenario(
    material: IMaterial,
    scenario: any
  ): Promise<any> {
    logger.info(`Simulating failure scenario for: ${material.name}`);

    const timeSteps = 100;
    const results = [];

    for (let t = 0; t < timeSteps; t++) {
      const time = t / timeSteps * scenario.duration;
      const degradation = this.calculateDegradation(material, scenario, time);
      
      results.push({
        time,
        degradation,
        remainingStrength: 100 - degradation,
        failureProbability: this.calculateFailureProbability(degradation)
      });
    }

    return {
      scenario: scenario.name,
      duration: scenario.duration,
      results,
      criticalTime: this.findCriticalTime(results),
      recommendations: this.generateScenarioRecommendations(results)
    };
  }

  private calculateDegradation(material: IMaterial, scenario: any, time: number): number {
    let degradation = 0;

    // Linear degradation
    degradation += time / scenario.duration * 20;

    // Accelerated degradation due to conditions
    if (scenario.temperature > 300) {
      degradation += Math.pow(time / scenario.duration, 2) * 30;
    }

    if (scenario.corrosiveEnvironment) {
      const resistance = material.properties.chemical.corrosionResistance;
      let corrosionRate = 1;
      if (resistance === 'poor') corrosionRate = 3;
      else if (resistance === 'fair') corrosionRate = 2;
      else if (resistance === 'good') corrosionRate = 0.5;
      
      degradation += time / scenario.duration * 25 * corrosionRate;
    }

    return Math.min(100, degradation);
  }

  private calculateFailureProbability(degradation: number): number {
    // Sigmoid function for failure probability
    return 1 / (1 + Math.exp(-(degradation - 70) / 10));
  }

  private findCriticalTime(results: any[]): number {
    const critical = results.find(r => r.failureProbability > 0.5);
    return critical ? critical.time : results[results.length - 1].time;
  }

  private generateScenarioRecommendations(results: any[]): string[] {
    const recommendations = [];
    const finalDegradation = results[results.length - 1].degradation;

    if (finalDegradation > 80) {
      recommendations.push('Material unsuitable for this scenario - select alternative');
    } else if (finalDegradation > 60) {
      recommendations.push('Implement aggressive maintenance schedule');
      recommendations.push('Consider protective measures');
    } else if (finalDegradation > 40) {
      recommendations.push('Regular monitoring recommended');
    } else {
      recommendations.push('Material suitable for application');
    }

    return recommendations;
  }
}
