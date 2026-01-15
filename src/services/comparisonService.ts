// Types based on the API Contract

export interface Highlight {
  title: string;
  detail: string;
}

export interface AttributeItem {
  type: 'label' | 'integration' | 'tag';
  value: string;
  has: boolean;
}

export interface ApplicationComparison {
  name: string;
  attributes: AttributeItem[];
  highlights: Highlight[];
}

export interface ComparisonResponse {
  company_a: ApplicationComparison;
  company_b: ApplicationComparison;
}

const API_BASE_URL = 'http://localhost:8000'; // Hardcoded as per contract instructions, should logically be env var

export const comparisonService = {
  async compareApplications(companyA: string, companyB: string): Promise<ComparisonResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Assuming no auth or token is handled globally if needed, 
        // contract says "Assumed NO authentication required OR Bearer token".
        // We'll stick to simple fetch for now.
      },
      body: JSON.stringify({
        company_a: companyA,
        company_b: companyB
      })
    });

    if (!response.ok) {
        let errorMessage = 'Comparison failed';
        try {
            const error = await response.json();
            errorMessage = error.detail || errorMessage;
        } catch (e) {
            errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
    }

    return await response.json();
  }
};
