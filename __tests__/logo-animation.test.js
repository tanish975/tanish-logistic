import fs from 'node:fs';
import path from 'node:path';

const logoSvg = fs.readFileSync(path.join(__dirname, '../public/logo-animated.svg'), 'utf8');

describe('animated TL logo timeline', () => {
  const phaseSchedule = [
    ['380', '0.54s', '0s'],
    ['459', '0.65s', '0.54s'],
    ['220', '0.65s', '0.54s'],
    ['461', '0.65s', '1.19s'],
  ];

  it('draws the T bar, T/L stems together, then the L sweep without gaps', () => {
    const animations = [...logoSvg.matchAll(
      /<animate attributeName="stroke-dashoffset" from="(\d+)" to="0" dur="([\d.]+s)" begin="([\d.]+s)"/g
    )].map(([, from, duration, begin]) => [from, duration, begin]);

    expect(animations).toEqual([...phaseSchedule, ...phaseSchedule]);
    expect(logoSvg.match(/keySplines="0\.25 0\.2 0\.75 0\.8"/g)).toHaveLength(8);
  });

  it('keeps each draw animation aligned with its visible fallback dash', () => {
    const paths = [...logoSvg.matchAll(
      /<path\b([^>]*)>\s*<animate attributeName="stroke-dashoffset" from="(\d+)"/g
    )];
    const expectedDashLengths = ['380', '459', '220', '461', '380', '459', '220', '461'];

    expect(paths).toHaveLength(8);
    paths.forEach(([pathMarkup, attributes, from], index) => {
      expect(attributes).toContain(`stroke-dasharray="${expectedDashLengths[index]}"`);
      expect(from).toBe(expectedDashLengths[index]);
      expect(pathMarkup).toContain('<animate attributeName="stroke-dashoffset"');
    });
  });
});
