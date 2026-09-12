export type ShadowStyle = 'none' | 'spread' | 'hug';
export type ShadowIntensity = 'low' | 'medium' | 'high';

export interface ShadowSettings {
  style: ShadowStyle;
  intensity: ShadowIntensity;
  lightSource: [number, number]; // [row, col] on a 5x5 grid (0..4), default is center [2, 2]
}

export const DEFAULT_SHADOW: ShadowSettings = {
  style: 'spread',
  intensity: 'medium',
  lightSource: [2, 2],
};

/**
 * Computes realistic multi-layer CSS box-shadow for mockups
 * based on shadow style, intensity, and 5x5 interactive light source coordinates.
 */
export function computeDeviceShadow(shadow?: ShadowSettings): string {
  if (!shadow || shadow.style === 'none') {
    return 'none';
  }

  const [row, col] = shadow.lightSource || [2, 2];
  // Calculate relative offset from center (2, 2)
  const dCol = col - 2; // -2 to +2 (light position along horizontal axis)
  const dRow = row - 2; // -2 to +2 (light position along vertical axis)

  // Shadow falls in the opposite direction of the incident light
  const shadowX = -dCol * 14;
  const shadowY = Math.max(8, 22 - dRow * 12);

  const intensityMultiplier = 
    shadow.intensity === 'low' ? 0.45 :
    shadow.intensity === 'high' ? 1.35 : 0.85;

  if (shadow.style === 'hug') {
    // Sharp, crisp contact shadow closely hugging the phone frame
    const a1 = (0.42 * intensityMultiplier).toFixed(2);
    const a2 = (0.28 * intensityMultiplier).toFixed(2);
    return `${(shadowX * 0.3).toFixed(1)}px ${Math.max(4, shadowY * 0.35).toFixed(1)}px 8px rgba(0,0,0,${a1}), ${(shadowX * 0.6).toFixed(1)}px ${Math.max(8, shadowY * 0.6).toFixed(1)}px 18px rgba(0,0,0,${a2})`;
  }

  // 'spread': deep, soft, diffused studio drop shadow
  const a1 = (0.20 * intensityMultiplier).toFixed(2);
  const a2 = (0.30 * intensityMultiplier).toFixed(2);
  const a3 = (0.22 * intensityMultiplier).toFixed(2);

  return `${(shadowX * 0.35).toFixed(1)}px ${(shadowY * 0.4).toFixed(1)}px 16px rgba(0,0,0,${a1}), ${(shadowX * 0.85).toFixed(1)}px ${(shadowY * 0.9).toFixed(1)}px 42px rgba(0,0,0,${a2}), ${(shadowX * 1.3).toFixed(1)}px ${(shadowY * 1.4).toFixed(1)}px 75px rgba(0,0,0,${a3})`;
}
