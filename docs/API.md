# Material Selection Assistant API Documentation

## Overview

The Material Selection Assistant API provides comprehensive endpoints for material discovery, AI-powered recommendations, and sustainability analysis.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication. In production, implement JWT-based authentication.

## Endpoints

### Materials

#### GET /materials
Get all materials with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by material category
- `domain` (string): Filter by application domain
- `recyclable` (boolean): Filter by recyclability
- `search` (string): Text search in material names and descriptions
- `sortBy` (string): Sort field (default: 'name')
- `sortOrder` (string): 'asc' or 'desc' (default: 'asc')

**Response:**
```json
{
  "materials": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### GET /materials/:id
Get a specific material by ID.

#### POST /materials/search
Advanced material search with AI-powered matching.

**Request Body:**
```json
{
  "requirements": {
    "mechanical": {
      "tensileStrength": { "min": 500 },
      "yieldStrength": { "min": 300 }
    },
    "thermal": {
      "operatingTemperature": { "min": -50, "max": 200 }
    },
    "chemical": {
      "corrosionResistance": "excellent",
      "chemicalCompatibility": ["seawater", "acids"]
    }
  },
  "domain": "oil_gas",
  "conditions": ["high_pressure", "corrosive"],
  "priorities": {
    "sustainability": 8,
    "cost": 6,
    "performance": 9,
    "availability": 7
  },
  "constraints": {
    "maxCost": 8,
    "maxLeadTime": 30,
    "requiredStandards": ["ASTM-A240"],
    "excludeMaterials": ["Material Name"]
  }
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "material": { ... },
      "score": 0.95,
      "reasoning": "AI-generated explanation",
      "matchDetails": {
        "mechanicalMatch": 0.9,
        "thermalMatch": 0.8,
        "chemicalMatch": 1.0,
        "sustainabilityScore": 0.7,
        "costScore": 0.6,
        "availabilityScore": 0.8
      },
      "risks": ["Long lead time may impact schedule"],
      "alternatives": ["Alternative Material 1", "Alternative Material 2"]
    }
  ],
  "searchCriteria": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### POST /materials/compare
Compare multiple materials.

**Request Body:**
```json
{
  "materialIds": ["id1", "id2", "id3"]
}
```

### AI Assistant

#### POST /ai/analyze-requirements
Extract material requirements from natural language description.

**Request Body:**
```json
{
  "description": "I need a corrosion-resistant material for offshore oil platform structures that can withstand high pressure and seawater exposure"
}
```

#### POST /ai/explain-selection
Get AI explanation for material selection.

**Request Body:**
```json
{
  "materialName": "AISI 316L Stainless Steel",
  "applicationContext": "offshore oil platform",
  "requirements": { ... }
}
```

#### POST /ai/simulate-behavior
Simulate material behavior under specific conditions.

**Request Body:**
```json
{
  "materialName": "Inconel 625",
  "conditions": ["high_temperature", "corrosive", "high_pressure"],
  "timeframe": "long-term"
}
```

### Chat Interface

#### POST /chat/message
Send message to AI assistant.

**Request Body:**
```json
{
  "message": "Find materials for high-temperature applications",
  "sessionId": "session-123",
  "context": {
    "previousMessages": [...]
  }
}
```

#### POST /chat/wizard/start
Start material selection wizard.

#### POST /chat/wizard/:sessionId/step/:step
Update wizard step with user input.

### Standards

#### GET /standards
Get all available standards.

#### GET /standards/:organization
Get standards by organization (ASTM, ISO, EN, DIN, etc.).

#### GET /standards/:organization/:designation
Get materials by specific standard.

#### GET /standards/search/:query
Search standards by designation or title.

#### POST /standards/compliance-check
Check material compliance with required standards.

**Request Body:**
```json
{
  "materialIds": ["id1", "id2"],
  "requiredStandards": ["ASTM-A240", "ISO-14001"]
}
```

### Sustainability

#### GET /materials/sustainability/report
Get comprehensive sustainability report.

**Response:**
```json
{
  "overview": {
    "totalMaterials": 2847,
    "recyclableMaterials": 2087,
    "recyclablePercentage": 73.3,
    "avgCarbonFootprint": 6.8
  },
  "categoryBreakdown": [...],
  "recommendations": [...]
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message",
  "details": "Additional error details (development only)"
}
```

## Rate Limiting

API requests are limited to 100 requests per minute per IP address.

## Data Models

### Material Schema

```typescript
interface Material {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  composition: {
    elements: Array<{
      element: string;
      percentage: number;
      range?: { min: number; max: number };
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
      operatingTemperature?: { min: number; max: number };
      thermalExpansion?: number;
      specificHeat?: number;
    };
  };
  standards: Array<{
    organization: string;
    designation: string;
    title: string;
    year?: number;
  }>;
  applications: Array<{
    domain: string;
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
    leadTime: number;
    costIndex: number;
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
```

## Usage Examples

### Find Materials for Specific Application

```javascript
const response = await fetch('/api/materials/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    requirements: {
      mechanical: { tensileStrength: { min: 500 } },
      thermal: { operatingTemperature: { min: -50, max: 200 } }
    },
    domain: 'oil_gas',
    conditions: ['high_pressure', 'corrosive'],
    priorities: { performance: 9, sustainability: 7 }
  })
});

const data = await response.json();
console.log(data.recommendations);
```

### Chat with AI Assistant

```javascript
const response = await fetch('/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'I need a lightweight, strong material for aerospace applications',
    sessionId: 'user-session-123'
  })
});

const data = await response.json();
console.log(data.message);
```