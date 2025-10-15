import mongoose, { Document, Schema } from 'mongoose';

export interface IMaterial extends Document {
  name: string;
  category: string;
  subcategory: string;
  composition: {
    elements: Array<{
      element: string;
      percentage: number;
      range?: {
        min: number;
        max: number;
      };
    }>;
  };
  properties: {
    mechanical: {
      tensileStrength?: number;
      yieldStrength?: number;
      elongation?: number;
      hardness?: number;
      fatigueLimit?: number;
      impactToughness?: number;
    };
    physical: {
      density?: number;
      meltingPoint?: number;
      thermalConductivity?: number;
      electricalResistivity?: number;
      magneticPermeability?: number;
    };
    chemical: {
      corrosionResistance?: string;
      oxidationResistance?: string;
      chemicalCompatibility?: string[];
    };
    thermal: {
      operatingTemperature?: {
        min: number;
        max: number;
      };
      thermalExpansion?: number;
      specificHeat?: number;
    };
  };
  standards: Array<{
    organization: string; // ASTM, DIN, EN, ISO, etc.
    designation: string;
    title: string;
    year?: number;
  }>;
  applications: Array<{
    domain: string; // cryogenics, mining, oil_gas, subsea, hygienic, power
    specificUse: string;
    conditions: string[];
    performance: string;
  }>;
  sustainability: {
    recyclable: boolean;
    recycledContent?: number;
    carbonFootprint?: number;
    eolTreatment: string;
    certifications?: string[];
  };
  availability: {
    suppliers: string[];
    leadTime: number; // days
    costIndex: number; // 1-10 scale
    regions: string[];
  };
  processability: {
    machining: string;
    welding: string;
    forming: string;
    heatTreatment?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  composition: {
    elements: [{
      element: { type: String, required: true },
      percentage: { type: Number, required: true },
      range: {
        min: Number,
        max: Number
      }
    }]
  },
  properties: {
    mechanical: {
      tensileStrength: Number,
      yieldStrength: Number,
      elongation: Number,
      hardness: Number,
      fatigueLimit: Number,
      impactToughness: Number
    },
    physical: {
      density: Number,
      meltingPoint: Number,
      thermalConductivity: Number,
      electricalResistivity: Number,
      magneticPermeability: Number
    },
    chemical: {
      corrosionResistance: String,
      oxidationResistance: String,
      chemicalCompatibility: [String]
    },
    thermal: {
      operatingTemperature: {
        min: Number,
        max: Number
      },
      thermalExpansion: Number,
      specificHeat: Number
    }
  },
  standards: [{
    organization: { type: String, required: true },
    designation: { type: String, required: true },
    title: { type: String, required: true },
    year: Number
  }],
  applications: [{
    domain: { type: String, required: true },
    specificUse: { type: String, required: true },
    conditions: [String],
    performance: String
  }],
  sustainability: {
    recyclable: { type: Boolean, required: true },
    recycledContent: Number,
    carbonFootprint: Number,
    eolTreatment: { type: String, required: true },
    certifications: [String]
  },
  availability: {
    suppliers: [String],
    leadTime: { type: Number, required: true },
    costIndex: { type: Number, required: true, min: 1, max: 10 },
    regions: [String]
  },
  processability: {
    machining: { type: String, required: true },
    welding: { type: String, required: true },
    forming: { type: String, required: true },
    heatTreatment: String
  }
}, {
  timestamps: true
});

// Indexes for efficient searching
MaterialSchema.index({ name: 'text', category: 'text', subcategory: 'text' });
MaterialSchema.index({ 'applications.domain': 1 });
MaterialSchema.index({ 'standards.organization': 1, 'standards.designation': 1 });
MaterialSchema.index({ 'sustainability.recyclable': 1 });

export const Material = mongoose.model<IMaterial>('Material', MaterialSchema);