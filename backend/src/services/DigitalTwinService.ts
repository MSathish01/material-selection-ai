import { logger } from '../utils/logger';

export interface DigitalTwin {
  materialId: string;
  materialName: string;
  deploymentData: {
    location: string;
    application: string;
    installDate: Date;
    operatingConditions: any;
  };
  realTimeData: {
    temperature: number;
    stress: number;
    strain: number;
    corrosionRate: number;
    timestamp: Date;
  }[];
  predictedLifetime: number;
  healthScore: number;
  maintenanceSchedule: MaintenanceEvent[];
  anomalies: Anomaly[];
}

export interface MaintenanceEvent {
  type: string;
  scheduledDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface Anomaly {
  detectedAt: Date;
  type: string;
  severity: number;
  description: string;
  recommendation: string;
}

export class DigitalTwinService {
  private twins: Map<string, DigitalTwin> = new Map();

  async createDigitalTwin(materialId: string, materialName: string, deploymentData: any): Promise<DigitalTwin> {
    logger.info(`Creating digital twin for material: ${materialName}`);

    const twin: DigitalTwin = {
      materialId,
      materialName,
      deploymentData: {
        ...deploymentData,
        installDate: new Date()
      },
      realTimeData: [],
      predictedLifetime: this.calculatePredictedLifetime(deploymentData),
      healthScore: 100,
      maintenanceSchedule: this.generateMaintenanceSchedule(deploymentData),
      anomalies: []
    };

    this.twins.set(materialId, twin);
    return twin;
  }

  async updateRealTimeData(materialId: string, sensorData: any): Promise<void> {
    const twin = this.twins.get(materialId);
    if (!twin) {
      throw new Error('Digital twin not found');
    }

    const dataPoint = {
      temperature: sensorData.temperature || 25,
      stress: sensorData.stress || 0,
      strain: sensorData.strain || 0,
      corrosionRate: sensorData.corrosionRate || 0,
      timestamp: new Date()
    };

    twin.realTimeData.push(dataPoint);

    // Keep only last 1000 data points
    if (twin.realTimeData.length > 1000) {
      twin.realTimeData = twin.realTimeData.slice(-1000);
    }

    // Update health score
    twin.healthScore = this.calculateHealthScore(twin);

    // Detect anomalies
    const anomaly = this.detectAnomalies(twin, dataPoint);
    if (anomaly) {
      twin.anomalies.push(anomaly);
    }

    // Update predicted lifetime
    twin.predictedLifetime = this.recalculateLifetime(twin);

    logger.info(`Updated digital twin for ${materialId}, health score: ${twin.healthScore}`);
  }

  async getDigitalTwin(materialId: string): Promise<DigitalTwin | null> {
    return this.twins.get(materialId) || null;
  }

  async predictFailure(materialId: string): Promise<any> {
    const twin = this.twins.get(materialId);
    if (!twin) {
      throw new Error('Digital twin not found');
    }

    const failureModes = this.analyzeFailureModes(twin);
    const timeToFailure = this.estimateTimeToFailure(twin);
    const recommendations = this.generateRecommendations(twin, failureModes);

    return {
      materialId,
      currentHealth: twin.healthScore,
      predictedLifetime: twin.predictedLifetime,
      timeToFailure,
      failureModes,
      recommendations,
      criticalFactors: this.identifyCriticalFactors(twin)
    };
  }

  private calculatePredictedLifetime(deploymentData: any): number {
    // Base lifetime in years
    let lifetime = 20;

    // Adjust based on operating conditions
    if (deploymentData.operatingConditions?.temperature > 100) {
      lifetime *= 0.7;
    }
    if (deploymentData.operatingConditions?.corrosiveEnvironment) {
      lifetime *= 0.6;
    }
    if (deploymentData.operatingConditions?.cyclicLoading) {
      lifetime *= 0.8;
    }

    return lifetime;
  }

  private calculateHealthScore(twin: DigitalTwin): number {
    if (twin.realTimeData.length === 0) return 100;

    const recent = twin.realTimeData.slice(-100);
    let score = 100;

    // Temperature impact
    const avgTemp = recent.reduce((sum, d) => sum + d.temperature, 0) / recent.length;
    if (avgTemp > 150) score -= 10;
    if (avgTemp > 200) score -= 20;

    // Stress impact
    const avgStress = recent.reduce((sum, d) => sum + d.stress, 0) / recent.length;
    if (avgStress > 300) score -= 15;
    if (avgStress > 500) score -= 25;

    // Corrosion impact
    const avgCorrosion = recent.reduce((sum, d) => sum + d.corrosionRate, 0) / recent.length;
    if (avgCorrosion > 0.1) score -= 10;
    if (avgCorrosion > 0.5) score -= 30;

    // Anomaly impact
    score -= twin.anomalies.length * 5;

    return Math.max(0, Math.min(100, score));
  }

  private detectAnomalies(twin: DigitalTwin, dataPoint: any): Anomaly | null {
    const recent = twin.realTimeData.slice(-50);
    if (recent.length < 10) return null;

    const avgTemp = recent.reduce((sum, d) => sum + d.temperature, 0) / recent.length;
    const avgStress = recent.reduce((sum, d) => sum + d.stress, 0) / recent.length;

    // Temperature spike detection
    if (dataPoint.temperature > avgTemp * 1.5) {
      return {
        detectedAt: new Date(),
        type: 'temperature_spike',
        severity: 0.8,
        description: `Temperature spike detected: ${dataPoint.temperature}°C (avg: ${avgTemp.toFixed(1)}°C)`,
        recommendation: 'Investigate cooling system and reduce operating temperature'
      };
    }

    // Stress anomaly detection
    if (dataPoint.stress > avgStress * 2) {
      return {
        detectedAt: new Date(),
        type: 'stress_anomaly',
        severity: 0.9,
        description: `Unusual stress level: ${dataPoint.stress} MPa (avg: ${avgStress.toFixed(1)} MPa)`,
        recommendation: 'Inspect for structural issues and reduce load'
      };
    }

    // Corrosion acceleration
    if (dataPoint.corrosionRate > 0.5) {
      return {
        detectedAt: new Date(),
        type: 'corrosion_acceleration',
        severity: 0.7,
        description: `High corrosion rate detected: ${dataPoint.corrosionRate} mm/year`,
        recommendation: 'Apply protective coating and improve environmental controls'
      };
    }

    return null;
  }

  private generateMaintenanceSchedule(deploymentData: any): MaintenanceEvent[] {
    const schedule: MaintenanceEvent[] = [];
    const now = new Date();

    // Routine inspection
    schedule.push({
      type: 'routine_inspection',
      scheduledDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days
      priority: 'low',
      description: 'Visual inspection and basic measurements'
    });

    // Detailed assessment
    schedule.push({
      type: 'detailed_assessment',
      scheduledDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months
      priority: 'medium',
      description: 'Comprehensive testing including NDT'
    });

    // Preventive maintenance
    schedule.push({
      type: 'preventive_maintenance',
      scheduledDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year
      priority: 'high',
      description: 'Surface treatment, coating renewal, and component replacement'
    });

    return schedule;
  }

  private recalculateLifetime(twin: DigitalTwin): number {
    const healthFactor = twin.healthScore / 100;
    const anomalyFactor = Math.max(0.5, 1 - (twin.anomalies.length * 0.05));
    
    const originalLifetime = this.calculatePredictedLifetime(twin.deploymentData);
    return originalLifetime * healthFactor * anomalyFactor;
  }

  private analyzeFailureModes(twin: DigitalTwin): any[] {
    const modes = [];

    if (twin.realTimeData.length > 0) {
      const recent = twin.realTimeData.slice(-100);
      const avgCorrosion = recent.reduce((sum, d) => sum + d.corrosionRate, 0) / recent.length;
      const avgStress = recent.reduce((sum, d) => sum + d.stress, 0) / recent.length;

      if (avgCorrosion > 0.1) {
        modes.push({
          mode: 'Corrosion Failure',
          probability: Math.min(0.9, avgCorrosion * 0.5),
          timeframe: `${Math.max(1, 10 / avgCorrosion).toFixed(1)} years`,
          indicators: ['Increasing corrosion rate', 'Surface degradation']
        });
      }

      if (avgStress > 400) {
        modes.push({
          mode: 'Fatigue Failure',
          probability: Math.min(0.8, avgStress / 600),
          timeframe: `${Math.max(2, 1000 / avgStress).toFixed(1)} years`,
          indicators: ['High cyclic stress', 'Potential crack initiation']
        });
      }
    }

    return modes;
  }

  private estimateTimeToFailure(twin: DigitalTwin): string {
    const healthScore = twin.healthScore;
    
    if (healthScore > 80) return '> 10 years';
    if (healthScore > 60) return '5-10 years';
    if (healthScore > 40) return '2-5 years';
    if (healthScore > 20) return '1-2 years';
    return '< 1 year - immediate action required';
  }

  private generateRecommendations(twin: DigitalTwin, failureModes: any[]): string[] {
    const recommendations = [];

    if (twin.healthScore < 70) {
      recommendations.push('Schedule comprehensive inspection within 30 days');
    }

    if (failureModes.some(m => m.mode.includes('Corrosion'))) {
      recommendations.push('Apply corrosion-resistant coating');
      recommendations.push('Improve environmental controls');
    }

    if (failureModes.some(m => m.mode.includes('Fatigue'))) {
      recommendations.push('Reduce operating stress levels');
      recommendations.push('Implement load monitoring system');
    }

    if (twin.anomalies.length > 5) {
      recommendations.push('Investigate root cause of recurring anomalies');
    }

    return recommendations;
  }

  private identifyCriticalFactors(twin: DigitalTwin): any[] {
    const factors = [];

    if (twin.realTimeData.length > 0) {
      const recent = twin.realTimeData.slice(-100);
      
      const tempVariance = this.calculateVariance(recent.map(d => d.temperature));
      const stressVariance = this.calculateVariance(recent.map(d => d.stress));

      if (tempVariance > 100) {
        factors.push({ factor: 'Temperature Fluctuation', impact: 'High', value: tempVariance.toFixed(1) });
      }

      if (stressVariance > 10000) {
        factors.push({ factor: 'Stress Variation', impact: 'High', value: stressVariance.toFixed(1) });
      }
    }

    return factors;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  }
}
