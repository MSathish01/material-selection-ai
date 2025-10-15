# 🚀 Quick Start Guide - Advanced Features

## Prerequisites

Make sure you have the basic application running:
- Node.js 18+
- MongoDB connection
- GEMINI_API_KEY or OPENAI_API_KEY in `.env`

## Start the Application

### 1. Start Backend
```bash
cd backend
npm install  # If not already done
npm run dev
```

Backend will run on: http://localhost:5000

### 2. Start Frontend
```bash
cd frontend
npm install  # If not already done
npm start
```

Frontend will run on: http://localhost:3000

## Try the Advanced Features

### 1. Generative Material Discovery 🧪

**URL**: http://localhost:3000/generative

**What to do:**
1. Enter target properties:
   - Tensile Strength: 600 MPa
   - Density: 7800 kg/m³
   - Thermal Conductivity: 50 W/m·K
   - Corrosion Resistance: High

2. Click "Generate Material"

3. View results:
   - Material composition (Fe, Cr, Ni, Mo percentages)
   - Predicted properties
   - Feasibility score
   - Estimated cost
   - Synthesis route

**API Test:**
```bash
curl -X POST http://localhost:5000/api/advanced/generate-material \
  -H "Content-Type: application/json" \
  -d '{
    "targetProperties": {
      "tensileStrength": 600,
      "density": 7800,
      "corrosionResistance": "high"
    }
  }'
```

---

### 2. Digital Material Twin 🔄

**URL**: http://localhost:3000/digital-twin

**What to do:**
1. Create a digital twin first via API:
```bash
curl -X POST http://localhost:5000/api/advanced/digital-twin/create \
  -H "Content-Type: application/json" \
  -d '{
    "materialId": "test-material-001",
    "materialName": "AISI 316L",
    "deploymentData": {
      "location": "Test Lab",
      "application": "Structural Test",
      "operatingConditions": {
        "temperature": 25,
        "corrosiveEnvironment": false
      }
    }
  }'
```

2. In the UI:
   - Enter Material ID: `test-material-001`
   - Click "Load Twin"
   - View health score, predicted lifetime, and data

3. Update sensor data:
   - Temperature: 45°C
   - Stress: 250 MPa
   - Strain: 0.002
   - Corrosion Rate: 0.1
   - Click "Update Sensor Data"

4. Watch the health score and anomaly detection in action!

---

### 3. Multi-Objective Optimization ⚖️

**URL**: http://localhost:3000/optimization

**What to do:**
1. Select objectives (check boxes):
   - ✅ Performance (weight: 8)
   - ✅ Cost (weight: 7)
   - ✅ Sustainability (weight: 6)

2. Click "Run Optimization"

3. View results:
   - Total solutions analyzed
   - Pareto-optimal solutions
   - Trade-off analysis
   - Recommendations

**API Test:**
```bash
curl -X POST http://localhost:5000/api/advanced/optimize/pareto-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "query": {},
    "objectives": [
      {"name": "performance", "weight": 0.8, "minimize": false},
      {"name": "cost", "weight": 0.7, "minimize": true},
      {"name": "sustainability", "weight": 0.6, "minimize": false}
    ]
  }'
```

---

### 4. Supply Chain Intelligence 🚚

**URL**: http://localhost:3000/supply-chain

**What to do:**
1. Enter material name: `AISI 316L`
2. Click "Analyze"

3. View results:
   - Availability score
   - Active suppliers
   - Average price
   - Price trend
   - Risk assessment
   - Supplier directory with ratings

**API Test:**
```bash
curl http://localhost:5000/api/advanced/supply-chain/AISI%20316L/analysis
```

---

### 5. Active Learning (API Only) 🎯

**Suggest Next Experiment:**
```bash
curl -X POST http://localhost:5000/api/advanced/active-learning/suggest-experiment \
  -H "Content-Type: application/json" \
  -d '{
    "property": "tensileStrength",
    "existingData": [
      {
        "composition": {"Fe": 70, "C": 1.0, "Cr": 18, "Ni": 10},
        "tensileStrength": 580
      }
    ],
    "constraints": {
      "Fe": {"min": 60, "max": 80}
    }
  }'
```

**Response shows:**
- Recommended composition to test
- Expected value
- Uncertainty
- Rationale

---

### 6. Failure Prediction (API Only) ⚠️

**Predict Failure Modes:**

First, get a material ID from your database, then:

```bash
curl -X POST http://localhost:5000/api/advanced/failure-prediction/predict \
  -H "Content-Type: application/json" \
  -d '{
    "materialId": "YOUR_MATERIAL_ID",
    "operatingConditions": {
      "temperature": 150,
      "maxStress": 400,
      "corrosiveEnvironment": true,
      "cyclicLoading": true,
      "humidity": 80
    }
  }'
```

**Response includes:**
- Failure modes (corrosion, fatigue, creep, etc.)
- Risk Priority Numbers (RPN)
- Stress analysis
- Predicted lifetime
- Maintenance schedule
- Preventive measures

---

## Example Workflow: Complete Material Analysis

### Scenario: Selecting material for offshore platform

```bash
# 1. Generate a custom material
curl -X POST http://localhost:5000/api/advanced/generate-material \
  -H "Content-Type: application/json" \
  -d '{
    "targetProperties": {
      "tensileStrength": 700,
      "corrosionResistance": "excellent"
    }
  }'

# 2. Check supply chain
curl http://localhost:5000/api/advanced/supply-chain/AISI%20316L/analysis

# 3. Predict failure modes
curl -X POST http://localhost:5000/api/advanced/failure-prediction/predict \
  -H "Content-Type: application/json" \
  -d '{
    "materialId": "YOUR_MATERIAL_ID",
    "operatingConditions": {
      "temperature": 25,
      "corrosiveEnvironment": true,
      "cyclicLoading": true
    }
  }'

# 4. Create digital twin for monitoring
curl -X POST http://localhost:5000/api/advanced/digital-twin/create \
  -H "Content-Type: application/json" \
  -d '{
    "materialId": "platform-001",
    "materialName": "AISI 316L",
    "deploymentData": {
      "location": "North Sea Platform",
      "application": "Structural Support"
    }
  }'
```

---

## Navigation

All advanced features are accessible from the sidebar under "Advanced Features":

- 🧪 **Generative Discovery** - Create new materials
- 🔄 **Digital Twin** - Monitor deployed materials
- ⚖️ **Multi-Objective** - Optimize trade-offs
- 🚚 **Supply Chain** - Analyze suppliers

---

## Troubleshooting

### Backend not starting?
```bash
cd backend
npm install
# Check .env file has GEMINI_API_KEY or OPENAI_API_KEY
npm run dev
```

### Frontend not loading?
```bash
cd frontend
npm install
npm start
```

### API errors?
- Check backend is running on port 5000
- Check MongoDB connection
- Check AI API key is valid

### No data showing?
- Run database seed: `cd backend && npm run seed`
- Check MongoDB is running

---

## Next Steps

1. **Explore Each Feature**: Try all 4 UI pages
2. **Test API Endpoints**: Use curl or Postman
3. **Read Documentation**: Check `docs/ADVANCED_FEATURES.md`
4. **Customize**: Modify algorithms for your needs
5. **Deploy**: Use Docker for production

---

## Support

- **Documentation**: `docs/ADVANCED_FEATURES.md`
- **API Reference**: `docs/API.md`
- **Issues**: GitHub Issues
- **Summary**: `ADVANCED_FEATURES_SUMMARY.md`

---

## 🎉 You're Ready!

All advanced features are now available. Start with Generative Discovery to create your first AI-designed material!

**Happy Material Engineering! 🚀**
