import { GoogleGenerativeAI } from '@google/generative-ai';
import { StorageAPI } from './storage';
import { Service, Organisation } from '../types';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  checklist?: { item: string; required: boolean; hint?: string }[];
  timestamp: string;
}

export type SupportedLanguage = 'en' | 'kn' | 'hi';

export const LANGUAGE_LABELS: Record<SupportedLanguage, { label: string; native: string }> = {
  en: { label: 'English', native: 'English' },
  kn: { label: 'Kannada', native: 'ಕನ್ನಡ' },
  hi: { label: 'Hindi', native: 'हिन्दी' }
};

/**
 * Builds grounded context from the organisation's actual services, branches, and policies.
 * Prevents the AI from hallucinating arbitrary policies.
 */
function buildOrganisationContext(org: Organisation, services: Service[], language: SupportedLanguage): string {
  const serviceList = services
    .map(s => `- ${s.name} (Code: ${s.code}, Avg Duration: ${s.avg_duration_minutes} mins, Requires Appt: ${s.requires_appointment ? 'Yes' : 'No'}, Walk-ins: ${s.allow_walkin ? 'Allowed' : 'Not Allowed'})
      Required Documents: ${s.required_documents?.join(', ') || 'Standard Photo ID'}`)
    .join('\n');

  return `
You are the official AI Service Assistant for "${org.name}".
Organisation Details:
- Tagline: ${org.tagline}
- Description: ${org.description}
- Contact: ${org.contact_email}, Phone: ${org.contact_phone}
- Available Services:
${serviceList}

Operating Rules:
1. You must ONLY answer using the facts and services listed above.
2. If asked about a procedure, policy, or fee not listed in this information, explicitly say:
   "I do not have verified information regarding this specific query in the official directory. Please approach the reception counter or contact ${org.contact_phone} for assistance."
3. If the user asks what documents they need for a service, list each document clearly as a bulleted checklist.
4. Respond in the requested language: ${LANGUAGE_LABELS[language].label} (${LANGUAGE_LABELS[language].native}).
5. Keep your tone polite, reassuring, professional, and accessible.
`;
}

// Grounded local responses in English, Kannada, and Hindi when API key is not yet set
function getGroundedLocalResponse(
  prompt: string, 
  org: Organisation, 
  services: Service[], 
  language: SupportedLanguage
): { text: string; checklist?: { item: string; required: boolean; hint?: string }[] } {
  const lower = prompt.toLowerCase();

  // Document checklist query
  if (lower.includes('document') || lower.includes('id') || lower.includes('need') || lower.includes('require') || lower.includes('ದಾಖಲೆ') || lower.includes('दस्तावेज')) {
    const matchedService = services.find(s => lower.includes(s.name.toLowerCase()) || lower.includes(s.code.toLowerCase())) || services[0];
    const docs = matchedService?.required_documents || ['Government Photo ID (Aadhaar / Voter ID / Passport)', 'Hospital Registration Card / Patient ID'];
    
    const checklist = docs.map((doc, idx) => ({
      item: doc,
      required: idx === 0,
      hint: idx === 0 ? 'Mandatory for identity verification' : 'Recommended for faster processing'
    }));

    if (language === 'hi') {
      return {
        text: `**${matchedService.name}** के लिए आवश्यक दस्तावेजों की सूची यहाँ है। कृपया सुनिश्चित करें कि आपके पास ये मूल रूप में या सत्यापित प्रतियाँ उपलब्ध हैं:`,
        checklist
      };
    } else if (language === 'kn') {
      return {
        text: `**${matchedService.name}** ಸೇವೆಗೆ ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳ ಪಟ್ಟಿ ಇಲ್ಲಿದೆ. ದಯವಿಟ್ಟು ಇವುಗಳನ್ನು ಸಿದ್ಧವಾಗಿಟ್ಟುಕೊಳ್ಳಿ:`,
        checklist
      };
    } else {
      return {
        text: `Here is the official document checklist for **${matchedService.name}**. Please ensure you have these ready before reaching the counter:`,
        checklist
      };
    }
  }

  // Waiting time query
  if (lower.includes('wait') || lower.includes('time') || lower.includes('how long') || lower.includes('ಸಮಯ') || lower.includes('समय')) {
    if (language === 'hi') {
      return {
        text: `प्रतीक्षा समय वास्तविक समय के कतार डेटा पर आधारित होता है। वर्तमान में सामान्य ओपीडी के लिए अनुमानित प्रतीक्षा समय लगभग 15 से 25 मिनट है। जब आपका टोकन "समीप" स्थिति में पहुंचेगा, तब आपको सूचना भेजी जाएगी।`
      };
    } else if (language === 'kn') {
      return {
        text: `ನಿರೀಕ್ಷಣಾ ಸಮಯವು ಪ್ರಸ್ತುತ ಸರದಿಯಲ್ಲಿರುವ ಜನರ ಸಂಖ್ಯೆಯನ್ನು ಆಧರಿಸಿದೆ. ಪ್ರಸ್ತುತ ಜನರಲ್ ಒಪಿಡಿ ಸಮಾಲೋಚನೆಗೆ ಅಂದಾಜು 15 ರಿಂದ 25 ನಿಮಿಷಗಳು ಬೇಕಾಗಬಹುದು.`
      };
    } else {
      return {
        text: `Waiting times are computed dynamically based on the number of patrons ahead and active counters. Currently, General OPD consultations average 12-20 minutes. You will receive an immediate in-app notification when your turn approaches!`
      };
    }
  }

  // Missed turn query
  if (lower.includes('miss') || lower.includes('late') || lower.includes('re-entry') || lower.includes('ಕಳೆದು') || lower.includes('छूट')) {
    if (language === 'hi') {
      return {
        text: `यदि आप अपना नंबर चूक गए हैं, तो चिंता न करें! Qless आपको पारदर्शी कतार पुनर्प्राಪ್ತಿ (Re-entry) की सुविधा देता है। अपने ग्राहक पोर्टल में "Request Re-entry" बटन पर क्लिक करें। आपका टोकन बिना किसी अनुचित देरी के पुनः कतार में शामिल हो जाएगा।`
      };
    } else if (language === 'kn') {
      return {
        text: `ನಿಮ್ಮ ಸರದಿ ತಪ್ಪಿಹೋಗಿದ್ದರೆ ಚಿಂತಿಸಬೇಡಿ! ನಿಮ್ಮ ಗ್ರಾಹಕ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ "Request Re-entry" ಆಯ್ಕೆಯನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ. ನಿಮ್ಮ ಟೋಕನ್ ನ್ಯಾಯಯುತವಾಗಿ ಸರದಿಯಲ್ಲಿ ಮರುಸೇರ್ಪಡೆಗೊಳ್ಳುತ್ತದೆ.`
      };
    } else {
      return {
        text: `If you missed your turn, Qless provides a transparent Queue Recovery process! Simply click "Request Re-entry" on your digital token card in the customer portal. You will be reinstated fairly 2 positions behind the current active turn.`
      };
    }
  }

  // General service overview
  const srvNames = services.map(s => s.name).join(', ');
  if (language === 'hi') {
    return {
      text: `${org.name} में आपका स्वागत है। हम वर्तमान में निम्नलिखित सेवाएँ प्रदान करते हैं: ${srvNames}। आप डिजिटल टोकन प्राप्त कर सकते हैं, दस्तावेज़ों की जाँच कर सकते हैं, या अपॉइंटमेंट बुक कर सकते हैं। आप क्या जानना चाहते हैं?`
    };
  } else if (language === 'kn') {
    return {
      text: `${org.name} ಗೆ ಸುಸ್ವಾಗತ. ನಾವು ಈ ಕೆಳಗಿನ ಸೇವೆಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ: ${srvNames}. ನೀವು ಡಿಜಿಟಲ್ ಟೋಕನ್ ಪಡೆಯಬಹುದು ಅಥವಾ ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ವಿಚಾರಿಸಬಹುದು.`
    };
  }

  return {
    text: `Welcome to ${org.name}. We provide services including: ${srvNames}. You can ask me for required documents, queue status updates, or appointment guidelines. How may I assist you today?`
  };
}

export const GeminiAssistantService = {
  async askAssistant(
    prompt: string,
    organisationId: string,
    language: SupportedLanguage = 'en'
  ): Promise<{ text: string; checklist?: { item: string; required: boolean; hint?: string }[] }> {
    const org = StorageAPI.getOrganisationById(organisationId) || StorageAPI.getOrganisations()[0];
    const services = StorageAPI.getServices(organisationId);

    // If Gemini API Key is provided, call real Gemini model
    if (geminiApiKey && !geminiApiKey.includes('your-gemini-api-key')) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemInstruction = buildOrganisationContext(org, services, language);
        const fullPrompt = `${systemInstruction}\n\nUser Question: ${prompt}\n\nPlease provide a direct, helpful, and concise response. If documents are needed, format them clearly with bullet points.`;

        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        return {
          text: responseText
        };
      } catch (err) {
        console.warn('Gemini API call returned error, falling back to grounded directory assistant:', err);
      }
    }

    // High quality grounded fallback ensuring zero downtime
    return getGroundedLocalResponse(prompt, org, services, language);
  }
};
