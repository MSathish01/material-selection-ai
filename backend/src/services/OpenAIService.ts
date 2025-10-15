import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

export class OpenAIService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;
  private useGemini: boolean = false;

  constructor() {
    // Check which AI service to use
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.useGemini = true;
      logger.info('Using Google Gemini AI');
    } else if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      this.useGemini = false;
      logger.info('Using OpenAI');
    } else {
      logger.warn('No AI API key configured. AI features will be limited.');
    }
  }

  async generateReasoning(prompt: string): Promise<string> {
    try {
      if (this.useGemini && this.gemini) {
        return await this.generateReasoningGemini(prompt);
      } else if (this.openai) {
        return await this.generateReasoningOpenAI(prompt);
      } else {
        return 'Material analysis based on engineering specifications and industry standards.';
      }
    } catch (error) {
      logger.error('AI API error:', error);
      return 'Material analysis based on engineering specifications and industry standards.';
    }
  }

  private async generateReasoningOpenAI(prompt: string): Promise<string> {
    const response = await this.openai!.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a materials engineering expert specializing in material selection for industrial applications. 
                   Provide concise, technical explanations focusing on material properties, performance characteristics, 
                   and suitability for specific applications. Always consider sustainability and cost factors.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.3
    });

    return response.choices[0]?.message?.content || 'Technical analysis completed.';
  }

  private async generateReasoningGemini(prompt: string): Promise<string> {
    const model = this.gemini!.getGenerativeModel({ model: 'gemini-pro' });
    
    const systemPrompt = `You are a materials engineering expert specializing in material selection for industrial applications. 
                         Provide concise, technical explanations focusing on material properties, performance characteristics, 
                         and suitability for specific applications. Always consider sustainability and cost factors.`;
    
    const fullPrompt = `${systemPrompt}\n\n${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text() || 'Technical analysis completed.';
  }

  async analyzeMaterialRequirements(userInput: string): Promise<any> {
    try {
      if (this.useGemini && this.gemini) {
        return await this.analyzeMaterialRequirementsGemini(userInput);
      } else if (this.openai) {
        return await this.analyzeMaterialRequirementsOpenAI(userInput);
      } else {
        return this.getDefaultRequirements();
      }
    } catch (error) {
      logger.error('AI requirements analysis error:', error);
      return this.getDefaultRequirements();
    }
  }

  private async analyzeMaterialRequirementsOpenAI(userInput: string): Promise<any> {
    const response = await this.openai!.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a materials engineering assistant. Extract material requirements from user descriptions.
                   Return a JSON object with the following structure:
                   {
                     "domain": "string (cryogenics, mining, oil_gas, subsea, hygienic, power)",
                     "conditions": ["array of operating conditions"],
                     "requirements": {
                       "mechanical": {"tensileStrength": {"min": number}, "yieldStrength": {"min": number}},
                       "thermal": {"operatingTemperature": {"min": number, "max": number}},
                       "chemical": {"corrosionResistance": "string", "chemicalCompatibility": ["array"]}
                     },
                     "priorities": {"sustainability": number, "cost": number, "performance": number, "availability": number}
                   }`
        },
        {
          role: 'user',
          content: userInput
        }
      ],
      max_tokens: 500,
      temperature: 0.2
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      try {
        return JSON.parse(content);
      } catch (parseError) {
        logger.error('Failed to parse OpenAI response:', parseError);
        return this.getDefaultRequirements();
      }
    }

    return this.getDefaultRequirements();
  }

  private async analyzeMaterialRequirementsGemini(userInput: string): Promise<any> {
    const model = this.gemini!.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `You are a materials engineering assistant. Extract material requirements from user descriptions.
                   Return ONLY a JSON object (no markdown, no explanation) with the following structure:
                   {
                     "domain": "string (cryogenics, mining, oil_gas, subsea, hygienic, power)",
                     "conditions": ["array of operating conditions"],
                     "requirements": {
                       "mechanical": {"tensileStrength": {"min": number}, "yieldStrength": {"min": number}},
                       "thermal": {"operatingTemperature": {"min": number, "max": number}},
                       "chemical": {"corrosionResistance": "string", "chemicalCompatibility": ["array"]}
                     },
                     "priorities": {"sustainability": number, "cost": number, "performance": number, "availability": number}
                   }
                   
                   User input: ${userInput}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Remove markdown code blocks if present
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(jsonText);
    } catch (parseError) {
      logger.error('Failed to parse Gemini response:', parseError);
      return this.getDefaultRequirements();
    }
  }

  async generateChatResponse(message: string, context?: any): Promise<string> {
    try {
      if (this.useGemini && this.gemini) {
        return await this.generateChatResponseGemini(message, context);
      } else if (this.openai) {
        return await this.generateChatResponseOpenAI(message, context);
      } else {
        return 'AI service is not configured. Please add GEMINI_API_KEY or OPENAI_API_KEY to your environment variables.';
      }
    } catch (error) {
      logger.error('AI chat response error:', error);
      return 'I apologize, but I\'m currently unable to process your request. Please try again later.';
    }
  }

  private async generateChatResponseOpenAI(message: string, context?: any): Promise<string> {
    const systemPrompt = `You are an expert materials engineer and AI assistant specializing in material selection.
                         You help engineers find the right materials for their applications by analyzing requirements,
                         suggesting suitable materials, and providing technical guidance.
                         
                         Key capabilities:
                         - Material property analysis and comparison
                         - Standards compliance (ASTM, DIN, EN, ISO)
                         - Sustainability assessment
                         - Cost and availability analysis
                         - Application-specific recommendations
                         
                         Always provide practical, actionable advice with technical justification.`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    if (context?.previousMessages) {
      messages.push(...context.previousMessages);
    }

    messages.push({ role: 'user', content: message });

    const response = await this.openai!.chat.completions.create({
      model: 'gpt-4',
      messages,
      max_tokens: 800,
      temperature: 0.4
    });

    return response.choices[0]?.message?.content || 'I apologize, but I encountered an issue processing your request. Please try again.';
  }

  private async generateChatResponseGemini(message: string, context?: any): Promise<string> {
    const model = this.gemini!.getGenerativeModel({ model: 'gemini-pro' });
    
    const systemPrompt = `You are an expert materials engineer and AI assistant specializing in material selection.
                         You help engineers find the right materials for their applications by analyzing requirements,
                         suggesting suitable materials, and providing technical guidance.
                         
                         Key capabilities:
                         - Material property analysis and comparison
                         - Standards compliance (ASTM, DIN, EN, ISO)
                         - Sustainability assessment
                         - Cost and availability analysis
                         - Application-specific recommendations
                         
                         Always provide practical, actionable advice with technical justification.`;
    
    let fullPrompt = systemPrompt + '\n\n';
    
    if (context?.previousMessages) {
      fullPrompt += 'Previous conversation:\n';
      context.previousMessages.forEach((msg: any) => {
        fullPrompt += `${msg.role}: ${msg.content}\n`;
      });
      fullPrompt += '\n';
    }
    
    fullPrompt += `User: ${message}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text() || 'I apologize, but I encountered an issue processing your request. Please try again.';
  }

  async simulateMaterialBehavior(materialName: string, conditions: string[]): Promise<any> {
    try {
      if (this.useGemini && this.gemini) {
        return await this.simulateMaterialBehaviorGemini(materialName, conditions);
      } else if (this.openai) {
        return await this.simulateMaterialBehaviorOpenAI(materialName, conditions);
      } else {
        return this.getDefaultSimulation();
      }
    } catch (error) {
      logger.error('Material simulation error:', error);
      return this.getDefaultSimulation();
    }
  }

  private async simulateMaterialBehaviorOpenAI(materialName: string, conditions: string[]): Promise<any> {
    const prompt = `Simulate the behavior of ${materialName} under the following conditions: ${conditions.join(', ')}.
                   Provide a technical analysis including:
                   1. Expected performance characteristics
                   2. Potential failure modes
                   3. Recommended operating parameters
                   4. Maintenance considerations
                   
                   Format as JSON with sections: performance, risks, recommendations, parameters.`;

    const response = await this.openai!.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a materials simulation expert. Provide detailed technical analysis of material behavior under specified conditions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 600,
      temperature: 0.3
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      try {
        return JSON.parse(content);
      } catch (parseError) {
        return {
          performance: 'Material performance analysis completed',
          risks: ['Standard material risks apply'],
          recommendations: ['Follow manufacturer guidelines'],
          parameters: 'Refer to material specifications'
        };
      }
    }

    return this.getDefaultSimulation();
  }

  private async simulateMaterialBehaviorGemini(materialName: string, conditions: string[]): Promise<any> {
    const model = this.gemini!.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Simulate the behavior of ${materialName} under the following conditions: ${conditions.join(', ')}.
                   Provide a technical analysis including:
                   1. Expected performance characteristics
                   2. Potential failure modes
                   3. Recommended operating parameters
                   4. Maintenance considerations
                   
                   Return ONLY a JSON object (no markdown) with sections: performance, risks, recommendations, parameters.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(jsonText);
    } catch (parseError) {
      return {
        performance: 'Material performance analysis completed',
        risks: ['Standard material risks apply'],
        recommendations: ['Follow manufacturer guidelines'],
        parameters: 'Refer to material specifications'
      };
    }
  }

  private getDefaultRequirements(): any {
    return {
      domain: 'general',
      conditions: ['ambient temperature', 'standard pressure'],
      requirements: {
        mechanical: {},
        thermal: {},
        chemical: {}
      },
      priorities: {
        sustainability: 5,
        cost: 5,
        performance: 8,
        availability: 6
      }
    };
  }

  private getDefaultSimulation(): any {
    return {
      performance: 'Material performance within expected parameters',
      risks: ['Monitor for standard wear patterns', 'Regular inspection recommended'],
      recommendations: ['Follow industry best practices', 'Maintain proper operating conditions'],
      parameters: 'Operate within manufacturer specifications'
    };
  }
}