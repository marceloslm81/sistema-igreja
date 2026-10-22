import AIFlowClient from '@devvibex/aiflow';
export const aiflow1020 = new AIFlowClient({
  appId: 'ck-67eNAawJyi3pkGDBq91RUiSZbu7PFHa8oRYwCsdxUpg',
  baseUrl: 'https://app.vibe-x.app/v1/aiflow',
});
export const aiflow1020ConfigPromise = aiflow1020.getConfig().catch((err) => {
  console.warn('AIFlow config preload failed:', err?.message);
  return null;
});