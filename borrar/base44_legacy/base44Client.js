import { createClient } from '@base44/sdk';

const base44 = createClient({
  appId: "6a0f9d4c25966874231c33ef",
  headers: {
    "api_key": "759ae6c91d9d40ffba70628d3c5e1ac9"
  }
});


export const db = base44;
export { base44 };
export default base44;