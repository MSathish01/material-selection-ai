import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Material } from '../models/Material';
import { logger } from '../utils/logger';

dotenv.config();

const sampleMaterials = [
  {
    name: 'AISI 316L Stainless Steel',
    category: 'Steel',
    subcategory: 'Austenitic Stainless Steel',
    composition: {
      elements: [
        { element: 'Fe', percentage: 68.0 },
        { element: 'Cr', percentage: 17.0, range: { min: 16.0, max: 18.0 } },
        { element: 'Ni', percentage: 10.0, range: { min: 10.0, max: 14.0 } },
        { element: 'Mo', percentage: 2.0, range: { min: 2.0, max: 3.0 } },
        { element: 'C', percentage: 0.03, range: { min: 0.0, max: 0.03 } }
      ]
    },
    properties: {
      mechanical: {
        tensileStrength: 580,
        yieldStrength: 290,
        elongation: 50,
        hardness: 217,
        fatigueLimit: 240,
        impactToughness: 300
      },
      physical: {
        density: 8000,
        meltingPoint: 1400,
        thermalConductivity: 16.2,
        electricalResistivity: 74,
        magneticPermeability: 1.02
      },
      chemical: {
        corrosionResistance: 'excellent',
        oxidationResistance: 'excellent',
        chemicalCompatibility: ['seawater', 'acids', 'chlorides', 'food_grade']
      },
      thermal: {
        operatingTemperature: { min: -196, max: 800 },
        thermalExpansion: 16.0,
        specificHeat: 500
      }
    },
    standards: [
      { organization: 'ASTM', designation: 'A240', title: 'Standard Specification for Chromium and Chromium-Nickel Stainless Steel Plate', year: 2020 },
      { organization: 'EN', designation: '10088-2', title: 'Stainless steels - Technical delivery conditions for sheet/plate and strip', year: 2014 },
      { organization: 'DIN', designation: '1.4404', title: 'Stainless steel designation', year: 2019 }
    ],
    applications: [
      { domain: 'oil_gas', specificUse: 'Offshore platform structures', conditions: ['seawater', 'high_pressure'], performance: 'excellent' },
      { domain: 'hygienic', specificUse: 'Food processing equipment', conditions: ['food_contact', 'cleaning_chemicals'], performance: 'excellent' },
      { domain: 'subsea', specificUse: 'Subsea manifolds', conditions: ['seawater', 'high_pressure', 'low_temperature'], performance: 'good' }
    ],
    sustainability: {
      recyclable: true,
      recycledContent: 60,
      carbonFootprint: 8.5,
      eolTreatment: 'fully_recyclable',
      certifications: ['ISO14001', 'REACH']
    },
    availability: {
      suppliers: ['Outokumpu', 'Acerinox', 'Aperam', 'ThyssenKrupp'],
      leadTime: 14,
      costIndex: 6,
      regions: ['Europe', 'North America', 'Asia']
    },
    processability: {
      machining: 'good',
      welding: 'excellent',
      forming: 'excellent',
      heatTreatment: 'solution_annealing'
    }
  },
  {
    name: 'Inconel 625',
    category: 'Nickel Alloy',
    subcategory: 'Superalloy',
    composition: {
      elements: [
        { element: 'Ni', percentage: 58.0, range: { min: 58.0, max: 63.0 } },
        { element: 'Cr', percentage: 21.5, range: { min: 20.0, max: 23.0 } },
        { element: 'Mo', percentage: 9.0, range: { min: 8.0, max: 10.0 } },
        { element: 'Nb', percentage: 3.6, range: { min: 3.15, max: 4.15 } },
        { element: 'Fe', percentage: 5.0, range: { min: 0.0, max: 5.0 } }
      ]
    },
    properties: {
      mechanical: {
        tensileStrength: 827,
        yieldStrength: 414,
        elongation: 30,
        hardness: 250,
        fatigueLimit: 350,
        impactToughness: 250
      },
      physical: {
        density: 8440,
        meltingPoint: 1350,
        thermalConductivity: 9.8,
        electricalResistivity: 129,
        magneticPermeability: 1.0
      },
      chemical: {
        corrosionResistance: 'excellent',
        oxidationResistance: 'excellent',
        chemicalCompatibility: ['seawater', 'acids', 'high_temperature_gases']
      },
      thermal: {
        operatingTemperature: { min: -253, max: 980 },
        thermalExpansion: 12.8,
        specificHeat: 410
      }
    },
    standards: [
      { organization: 'ASTM', designation: 'B443', title: 'Standard Specification for Nickel-Chromium-Molybdenum-Columbium Alloy', year: 2019 },
      { organization: 'UNS', designation: 'N06625', title: 'Unified Numbering System', year: 2020 }
    ],
    applications: [
      { domain: 'oil_gas', specificUse: 'Downhole tubing', conditions: ['high_temperature', 'corrosive', 'high_pressure'], performance: 'excellent' },
      { domain: 'power', specificUse: 'Gas turbine components', conditions: ['high_temperature', 'oxidizing'], performance: 'excellent' },
      { domain: 'cryogenics', specificUse: 'LNG processing equipment', conditions: ['cryogenic', 'thermal_cycling'], performance: 'good' }
    ],
    sustainability: {
      recyclable: true,
      recycledContent: 35,
      carbonFootprint: 15.2,
      eolTreatment: 'recyclable_with_processing',
      certifications: ['ISO14001']
    },
    availability: {
      suppliers: ['Special Metals', 'Haynes International', 'VDM Metals'],
      leadTime: 45,
      costIndex: 9,
      regions: ['North America', 'Europe']
    },
    processability: {
      machining: 'difficult',
      welding: 'good',
      forming: 'fair',
      heatTreatment: 'solution_annealing'
    }
  },
  {
    name: 'Aluminum 6061-T6',
    category: 'Aluminum',
    subcategory: 'Heat Treatable Alloy',
    composition: {
      elements: [
        { element: 'Al', percentage: 97.9 },
        { element: 'Mg', percentage: 1.0, range: { min: 0.8, max: 1.2 } },
        { element: 'Si', percentage: 0.6, range: { min: 0.4, max: 0.8 } },
        { element: 'Cu', percentage: 0.28, range: { min: 0.15, max: 0.4 } },
        { element: 'Cr', percentage: 0.2, range: { min: 0.04, max: 0.35 } }
      ]
    },
    properties: {
      mechanical: {
        tensileStrength: 310,
        yieldStrength: 276,
        elongation: 12,
        hardness: 95,
        fatigueLimit: 96,
        impactToughness: 29
      },
      physical: {
        density: 2700,
        meltingPoint: 582,
        thermalConductivity: 167,
        electricalResistivity: 4.0,
        magneticPermeability: 1.0
      },
      chemical: {
        corrosionResistance: 'good',
        oxidationResistance: 'good',
        chemicalCompatibility: ['atmospheric', 'fresh_water']
      },
      thermal: {
        operatingTemperature: { min: -80, max: 200 },
        thermalExpansion: 23.6,
        specificHeat: 896
      }
    },
    standards: [
      { organization: 'ASTM', designation: 'B221', title: 'Standard Specification for Aluminum and Aluminum-Alloy Extruded Bars', year: 2020 },
      { organization: 'EN', designation: 'AW-6061', title: 'Aluminum and aluminum alloys - Chemical composition', year: 2019 }
    ],
    applications: [
      { domain: 'general', specificUse: 'Structural components', conditions: ['ambient', 'lightweight_required'], performance: 'good' },
      { domain: 'power', specificUse: 'Electrical conductors', conditions: ['electrical_conduction'], performance: 'excellent' }
    ],
    sustainability: {
      recyclable: true,
      recycledContent: 85,
      carbonFootprint: 3.2,
      eolTreatment: 'fully_recyclable',
      certifications: ['ASI', 'ISO14001']
    },
    availability: {
      suppliers: ['Alcoa', 'Norsk Hydro', 'Rusal', 'Chalco'],
      leadTime: 7,
      costIndex: 3,
      regions: ['Global']
    },
    processability: {
      machining: 'excellent',
      welding: 'good',
      forming: 'excellent',
      heatTreatment: 'T6_temper'
    }
  },
  {
    name: 'Hastelloy C-276',
    category: 'Nickel Alloy',
    subcategory: 'Corrosion Resistant Alloy',
    composition: {
      elements: [
        { element: 'Ni', percentage: 57.0, range: { min: 54.0, max: 60.0 } },
        { element: 'Cr', percentage: 15.5, range: { min: 14.5, max: 16.5 } },
        { element: 'Mo', percentage: 16.0, range: { min: 15.0, max: 17.0 } },
        { element: 'W', percentage: 3.7, range: { min: 3.0, max: 4.5 } },
        { element: 'Fe', percentage: 5.5, range: { min: 4.0, max: 7.0 } }
      ]
    },
    properties: {
      mechanical: {
        tensileStrength: 690,
        yieldStrength: 283,
        elongation: 40,
        hardness: 217,
        fatigueLimit: 310,
        impactToughness: 200
      },
      physical: {
        density: 8890,
        meltingPoint: 1370,
        thermalConductivity: 10.0,
        electricalResistivity: 130,
        magneticPermeability: 1.0
      },
      chemical: {
        corrosionResistance: 'excellent',
        oxidationResistance: 'excellent',
        chemicalCompatibility: ['acids', 'chlorides', 'reducing_environments', 'oxidizing_environments']
      },
      thermal: {
        operatingTemperature: { min: -196, max: 650 },
        thermalExpansion: 11.2,
        specificHeat: 427
      }
    },
    standards: [
      { organization: 'ASTM', designation: 'B575', title: 'Standard Specification for Low-Carbon Nickel-Molybdenum-Chromium Alloys', year: 2018 },
      { organization: 'UNS', designation: 'N10276', title: 'Unified Numbering System', year: 2020 }
    ],
    applications: [
      { domain: 'oil_gas', specificUse: 'Sour gas service', conditions: ['H2S', 'high_temperature', 'corrosive'], performance: 'excellent' },
      { domain: 'mining', specificUse: 'Acid leaching equipment', conditions: ['strong_acids', 'abrasive'], performance: 'excellent' }
    ],
    sustainability: {
      recyclable: true,
      recycledContent: 40,
      carbonFootprint: 18.5,
      eolTreatment: 'recyclable_with_processing',
      certifications: ['ISO14001']
    },
    availability: {
      suppliers: ['Haynes International', 'Special Metals', 'VDM Metals'],
      leadTime: 60,
      costIndex: 10,
      regions: ['North America', 'Europe']
    },
    processability: {
      machining: 'difficult',
      welding: 'good',
      forming: 'fair',
      heatTreatment: 'solution_annealing'
    }
  },
  {
    name: 'PEEK (Polyetheretherketone)',
    category: 'Polymer',
    subcategory: 'High Performance Thermoplastic',
    composition: {
      elements: [
        { element: 'C', percentage: 76.0 },
        { element: 'H', percentage: 4.8 },
        { element: 'O', percentage: 19.2 }
      ]
    },
    properties: {
      mechanical: {
        tensileStrength: 100,
        yieldStrength: 90,
        elongation: 50,
        hardness: 40,
        fatigueLimit: 45,
        impactToughness: 85
      },
      physical: {
        density: 1320,
        meltingPoint: 343,
        thermalConductivity: 0.25,
        electricalResistivity: 1e16,
        magneticPermeability: 1.0
      },
      chemical: {
        corrosionResistance: 'excellent',
        oxidationResistance: 'excellent',
        chemicalCompatibility: ['acids', 'bases', 'solvents', 'hydrocarbons']
      },
      thermal: {
        operatingTemperature: { min: -60, max: 250 },
        thermalExpansion: 47.0,
        specificHeat: 1340
      }
    },
    standards: [
      { organization: 'ASTM', designation: 'D6262', title: 'Standard Test Method for Determining the Mode II Interlaminar Fracture Toughness', year: 2017 },
      { organization: 'ISO', designation: '19095', title: 'Plastics - Evaluation of the adhesion interface performance', year: 2015 }
    ],
    applications: [
      { domain: 'oil_gas', specificUse: 'Downhole seals', conditions: ['high_temperature', 'chemical_exposure'], performance: 'excellent' },
      { domain: 'hygienic', specificUse: 'Medical implants', conditions: ['biocompatible', 'sterilizable'], performance: 'excellent' }
    ],
    sustainability: {
      recyclable: true,
      recycledContent: 15,
      carbonFootprint: 4.8,
      eolTreatment: 'recyclable_thermoplastic',
      certifications: ['USP_Class_VI', 'FDA']
    },
    availability: {
      suppliers: ['Victrex', 'Solvay', 'Evonik'],
      leadTime: 21,
      costIndex: 8,
      regions: ['Europe', 'North America', 'Asia']
    },
    processability: {
      machining: 'excellent',
      welding: 'not_applicable',
      forming: 'injection_molding',
      heatTreatment: 'not_required'
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/material-selection');
    logger.info('Connected to MongoDB for seeding');

    // Clear existing materials
    await Material.deleteMany({});
    logger.info('Cleared existing materials');

    // Insert sample materials
    const insertedMaterials = await Material.insertMany(sampleMaterials);
    logger.info(`Inserted ${insertedMaterials.length} sample materials`);

    // Create additional materials programmatically
    const additionalMaterials = [];
    
    // Generate more steel variants
    const steelGrades = ['304', '316', '321', '347', '410', '420', '440C'];
    for (const grade of steelGrades) {
      if (grade !== '316L') { // Already exists
        additionalMaterials.push({
          name: `AISI ${grade} Stainless Steel`,
          category: 'Steel',
          subcategory: grade.startsWith('4') ? 'Martensitic Stainless Steel' : 'Austenitic Stainless Steel',
          composition: {
            elements: [
              { element: 'Fe', percentage: 70.0 },
              { element: 'Cr', percentage: 18.0 },
              { element: 'Ni', percentage: grade.startsWith('4') ? 0 : 8.0 }
            ]
          },
          properties: {
            mechanical: {
              tensileStrength: 500 + Math.random() * 300,
              yieldStrength: 200 + Math.random() * 200,
              hardness: 150 + Math.random() * 100
            },
            thermal: {
              operatingTemperature: { min: -50, max: 600 + Math.random() * 200 }
            },
            chemical: {
              corrosionResistance: 'good',
              chemicalCompatibility: ['atmospheric', 'mild_acids']
            }
          },
          standards: [
            { organization: 'ASTM', designation: 'A240', title: 'Standard Specification for Stainless Steel Plate' }
          ],
          applications: [
            { domain: 'general', specificUse: 'General purpose applications', conditions: ['ambient'] }
          ],
          sustainability: {
            recyclable: true,
            carbonFootprint: 8 + Math.random() * 4,
            eolTreatment: 'fully_recyclable'
          },
          availability: {
            suppliers: ['Generic Steel Co'],
            leadTime: 14 + Math.floor(Math.random() * 21),
            costIndex: 4 + Math.floor(Math.random() * 4),
            regions: ['Global']
          },
          processability: {
            machining: 'good',
            welding: 'good',
            forming: 'good'
          }
        });
      }
    }

    // Generate aluminum alloys
    const aluminumGrades = ['2024', '5083', '6063', '7075'];
    for (const grade of aluminumGrades) {
      additionalMaterials.push({
        name: `Aluminum ${grade}`,
        category: 'Aluminum',
        subcategory: 'Wrought Alloy',
        composition: {
          elements: [
            { element: 'Al', percentage: 95.0 + Math.random() * 3 },
            { element: 'Mg', percentage: Math.random() * 2 },
            { element: 'Si', percentage: Math.random() * 1 }
          ]
        },
        properties: {
          mechanical: {
            tensileStrength: 200 + Math.random() * 400,
            yieldStrength: 100 + Math.random() * 300,
            hardness: 60 + Math.random() * 80
          },
          thermal: {
            operatingTemperature: { min: -80, max: 150 + Math.random() * 100 }
          },
          chemical: {
            corrosionResistance: 'good',
            chemicalCompatibility: ['atmospheric']
          }
        },
        standards: [
          { organization: 'ASTM', designation: 'B221', title: 'Standard Specification for Aluminum Alloy Extruded Bars' }
        ],
        applications: [
          { domain: 'general', specificUse: 'Lightweight structures', conditions: ['ambient'] }
        ],
        sustainability: {
          recyclable: true,
          recycledContent: 70 + Math.random() * 20,
          carbonFootprint: 2 + Math.random() * 3,
          eolTreatment: 'fully_recyclable'
        },
        availability: {
          suppliers: ['Aluminum Corp'],
          leadTime: 7 + Math.floor(Math.random() * 14),
          costIndex: 2 + Math.floor(Math.random() * 3),
          regions: ['Global']
        },
        processability: {
          machining: 'excellent',
          welding: 'good',
          forming: 'excellent'
        }
      });
    }

    if (additionalMaterials.length > 0) {
      await Material.insertMany(additionalMaterials);
      logger.info(`Inserted ${additionalMaterials.length} additional materials`);
    }

    const totalCount = await Material.countDocuments();
    logger.info(`Database seeded successfully with ${totalCount} total materials`);

  } catch (error) {
    logger.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };