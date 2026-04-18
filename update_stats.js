import fs from 'fs';

const filePath = 'src/constants/gameData.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Add explosiveness to stats objects that don't have it
content = content.replace(/stats: \{ ([^}]+) \}/g, (match, p1) => {
  if (p1.includes('explosiveness')) return match;
  // Generate a random-ish value for existing ones based on their speed/stamina
  const speedMatch = p1.match(/speed: (\d+)/);
  const speed = speedMatch ? parseInt(speedMatch[1]) : 500;
  const explosiveness = Math.floor(400 + Math.random() * 400);
  return `stats: { ${p1}, explosiveness: ${explosiveness} }`;
});

fs.writeFileSync(filePath, content);
console.log('Updated gameData.ts with explosiveness');
