import { logger } from '../utils/logger';

export interface SupplierInfo {
  name: string;
  location: string;
  price: number;
  currency: string;
  leadTime: number;
  minimumOrder: number;
  inStock: boolean;
  rating: number;
  certifications: string[];
}

export interface SupplyChainAnalysis {
  material: string;
  suppliers: SupplierInfo[];
  priceAnalysis: {
    average: number;
    min: number;
    max: number;
    trend: string;
  };
  availabilityScore: number;
  riskAssessment: {
    supplyRisk: string;
    geopoliticalRisk: string;
    priceVolatility: string;
  };
  recommendations: string[];
}

export class SupplyChainService {
  private mockSupplierDatabase: Map<string, SupplierInfo[]> = new Map();

  constructor() {
    this.initializeMockData();
  }

  async getSupplierInfo(materialName: string): Promise<SupplierInfo[]> {
    logger.info(`Fetching supplier info for: ${materialName}`);

    // In production, this would call real supplier APIs
    // For now, return mock data with realistic variations
    const suppliers = this.mockSupplierDatabase.get(materialName) || this.generateMockSuppliers(materialName);
    
    // Simulate real-time price fluctuations
    return suppliers.map(supplier => ({
      ...supplier,
      price: supplier.price * (0.95 + Math.random() * 0.1), // ±5% variation
      inStock: Math.random() > 0.2 // 80% availability
    }));
  }

  async analyzePricing(materialName: string): Promise<any> {
    const suppliers = await this.getSupplierInfo(materialName);
    
    if (suppliers.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
        trend: 'unknown',
        volatility: 0
      };
    }

    const prices = suppliers.map(s => s.price);
    const average = prices.reduce((a, b) => a + b, 0) / prices.length;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    // Calculate price volatility
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - average, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance) / average;

    return {
      average: average.toFixed(2),
      min: min.toFixed(2),
      max: max.toFixed(2),
      trend: this.determinePriceTrend(materialName),
      volatility: (volatility * 100).toFixed(2) + '%',
      savingsOpportunity: ((max - min) / max * 100).toFixed(1) + '%'
    };
  }

  async getLeadTimeEstimate(materialName: string, quantity: number, location: string): Promise<any> {
    const suppliers = await this.getSupplierInfo(materialName);
    
    // Filter suppliers by location proximity
    const nearbySuppliers = suppliers.filter(s => 
      this.calculateDistance(s.location, location) < 5000 // Within 5000 km
    );

    const relevantSuppliers = nearbySuppliers.length > 0 ? nearbySuppliers : suppliers;

    if (relevantSuppliers.length === 0) {
      return {
        estimated: 90,
        range: { min: 60, max: 120 },
        confidence: 'low'
      };
    }

    const leadTimes = relevantSuppliers
      .filter(s => s.inStock && quantity >= s.minimumOrder)
      .map(s => s.leadTime);

    if (leadTimes.length === 0) {
      return {
        estimated: 60,
        range: { min: 45, max: 90 },
        confidence: 'medium',
        note: 'May require special order'
      };
    }

    const avgLeadTime = leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length;

    return {
      estimated: Math.round(avgLeadTime),
      range: {
        min: Math.min(...leadTimes),
        max: Math.max(...leadTimes)
      },
      confidence: leadTimes.length > 3 ? 'high' : 'medium',
      fastestSupplier: relevantSuppliers.reduce((prev, curr) => 
        curr.leadTime < prev.leadTime ? curr : prev
      ).name
    };
  }

  async performSupplyChainAnalysis(materialName: string): Promise<SupplyChainAnalysis> {
    const suppliers = await this.getSupplierInfo(materialName);
    const priceAnalysis = await this.analyzePricing(materialName);
    
    const availabilityScore = this.calculateAvailabilityScore(suppliers);
    const riskAssessment = this.assessSupplyRisk(suppliers, materialName);
    const recommendations = this.generateRecommendations(suppliers, priceAnalysis, riskAssessment);

    return {
      material: materialName,
      suppliers,
      priceAnalysis,
      availabilityScore,
      riskAssessment,
      recommendations
    };
  }

  private calculateAvailabilityScore(suppliers: SupplierInfo[]): number {
    if (suppliers.length === 0) return 0;

    let score = 0;
    
    // Supplier count (max 30 points)
    score += Math.min(30, suppliers.length * 6);
    
    // In-stock availability (max 30 points)
    const inStockCount = suppliers.filter(s => s.inStock).length;
    score += (inStockCount / suppliers.length) * 30;
    
    // Geographic diversity (max 20 points)
    const uniqueLocations = new Set(suppliers.map(s => s.location)).size;
    score += Math.min(20, uniqueLocations * 5);
    
    // Supplier ratings (max 20 points)
    const avgRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;
    score += (avgRating / 5) * 20;

    return Math.round(score);
  }

  private assessSupplyRisk(suppliers: SupplierInfo[], materialName: string): any {
    const locationCount = new Set(suppliers.map(s => s.location)).size;
    const avgRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;
    const inStockRatio = suppliers.filter(s => s.inStock).length / suppliers.length;

    return {
      supplyRisk: locationCount < 2 ? 'high' : locationCount < 4 ? 'medium' : 'low',
      geopoliticalRisk: this.assessGeopoliticalRisk(suppliers),
      priceVolatility: this.assessPriceVolatility(materialName),
      overallRisk: avgRating > 4 && inStockRatio > 0.7 ? 'low' : avgRating > 3 ? 'medium' : 'high'
    };
  }

  private assessGeopoliticalRisk(suppliers: SupplierInfo[]): string {
    const highRiskRegions = ['Region A', 'Region B']; // Placeholder
    const suppliersInHighRisk = suppliers.filter(s => 
      highRiskRegions.some(region => s.location.includes(region))
    ).length;

    if (suppliersInHighRisk / suppliers.length > 0.5) return 'high';
    if (suppliersInHighRisk > 0) return 'medium';
    return 'low';
  }

  private assessPriceVolatility(materialName: string): string {
    // Simulate historical price analysis
    const volatileMaterials = ['Nickel', 'Cobalt', 'Lithium'];
    if (volatileMaterials.some((m: string) => materialName.includes(m))) return 'high';
    
    const moderateVolatility = ['Copper', 'Aluminum', 'Zinc'];
    if (moderateVolatility.some(m => materialName.includes(m))) return 'medium';
    
    return 'low';
  }

  private generateRecommendations(suppliers: SupplierInfo[], priceAnalysis: any, risk: any): string[] {
    const recommendations = [];

    if (suppliers.length < 3) {
      recommendations.push('Consider diversifying supplier base to reduce supply chain risk');
    }

    if (risk.supplyRisk === 'high') {
      recommendations.push('High supply risk detected - establish backup suppliers');
    }

    const prices = suppliers.map(s => s.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const cheapest = Math.min(...prices);
    
    if ((avgPrice - cheapest) / avgPrice > 0.15) {
      recommendations.push(`Potential savings of ${((avgPrice - cheapest) / avgPrice * 100).toFixed(1)}% by switching suppliers`);
    }

    const fastSuppliers = suppliers.filter(s => s.leadTime < 14);
    if (fastSuppliers.length > 0) {
      recommendations.push(`${fastSuppliers.length} suppliers offer delivery within 2 weeks`);
    }

    if (risk.priceVolatility === 'high') {
      recommendations.push('Consider long-term contracts to hedge against price volatility');
    }

    return recommendations;
  }

  private determinePriceTrend(materialName: string): string {
    // Simulate trend analysis
    const random = Math.random();
    if (random > 0.6) return 'increasing';
    if (random < 0.4) return 'decreasing';
    return 'stable';
  }

  private calculateDistance(location1: string, location2: string): number {
    // Simplified distance calculation
    // In production, use actual geolocation APIs
    return Math.random() * 10000;
  }

  private initializeMockData(): void {
    // Initialize with some common materials
    this.mockSupplierDatabase.set('AISI 316L', this.generateMockSuppliers('AISI 316L'));
    this.mockSupplierDatabase.set('Aluminum 6061', this.generateMockSuppliers('Aluminum 6061'));
    this.mockSupplierDatabase.set('Carbon Steel', this.generateMockSuppliers('Carbon Steel'));
  }

  private generateMockSuppliers(materialName: string): SupplierInfo[] {
    const supplierCount = 3 + Math.floor(Math.random() * 5);
    const suppliers: SupplierInfo[] = [];

    const locations = ['USA', 'Germany', 'China', 'Japan', 'India', 'South Korea', 'Brazil'];
    const basePrice = this.getBasePrice(materialName);

    for (let i = 0; i < supplierCount; i++) {
      suppliers.push({
        name: `Supplier ${String.fromCharCode(65 + i)}`,
        location: locations[i % locations.length],
        price: basePrice * (0.8 + Math.random() * 0.4),
        currency: 'USD',
        leadTime: 7 + Math.floor(Math.random() * 60),
        minimumOrder: 100 + Math.floor(Math.random() * 900),
        inStock: Math.random() > 0.3,
        rating: 3 + Math.random() * 2,
        certifications: this.generateCertifications()
      });
    }

    return suppliers;
  }

  private getBasePrice(materialName: string): number {
    if (materialName.includes('316')) return 8.5;
    if (materialName.includes('Aluminum')) return 3.2;
    if (materialName.includes('Carbon')) return 1.5;
    if (materialName.includes('Titanium')) return 25;
    return 5.0;
  }

  private generateCertifications(): string[] {
    const allCerts = ['ISO 9001', 'ISO 14001', 'AS9100', 'NADCAP', 'IATF 16949'];
    const count = 1 + Math.floor(Math.random() * 3);
    return allCerts.slice(0, count);
  }

  async trackShipment(orderId: string): Promise<any> {
    // Mock shipment tracking
    return {
      orderId,
      status: 'in_transit',
      currentLocation: 'Distribution Center',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      trackingEvents: [
        { date: new Date(), event: 'Order confirmed', location: 'Supplier facility' },
        { date: new Date(), event: 'Shipped', location: 'Origin port' },
        { date: new Date(), event: 'In transit', location: 'Distribution center' }
      ]
    };
  }
}
