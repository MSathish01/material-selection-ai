import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const materialQuerySchema = Joi.object({
  requirements: Joi.object({
    mechanical: Joi.object({
      tensileStrength: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0)
      }),
      yieldStrength: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0)
      }),
      hardness: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0)
      })
    }),
    thermal: Joi.object({
      operatingTemperature: Joi.object({
        min: Joi.number(),
        max: Joi.number()
      }),
      thermalConductivity: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0)
      })
    }),
    chemical: Joi.object({
      corrosionResistance: Joi.string().valid('excellent', 'good', 'fair', 'poor'),
      chemicalCompatibility: Joi.array().items(Joi.string())
    })
  }),
  domain: Joi.string().valid('cryogenics', 'mining', 'oil_gas', 'subsea', 'hygienic', 'power', 'general').required(),
  conditions: Joi.array().items(Joi.string()).required(),
  priorities: Joi.object({
    sustainability: Joi.number().min(1).max(10),
    cost: Joi.number().min(1).max(10),
    performance: Joi.number().min(1).max(10),
    availability: Joi.number().min(1).max(10)
  }),
  constraints: Joi.object({
    maxCost: Joi.number().min(1).max(10),
    maxLeadTime: Joi.number().min(0),
    requiredStandards: Joi.array().items(Joi.string()),
    excludeMaterials: Joi.array().items(Joi.string())
  })
});

export const validateMaterialQuery = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = materialQuerySchema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
    return;
  }
  
  next();
};