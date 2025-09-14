const fs = require('fs');
const path = require('path');

// Función para convertir imagen a base64
function imageToBase64(imagePath) {
  try {
    const data = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).toLowerCase();
    let mimeType = 'image/png';
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg';
        break;
      case '.gif':
        mimeType = 'image/gif';
        break;
      case '.webp':
        mimeType = 'image/webp';
        break;
      case '.svg':
        mimeType = 'image/svg+xml';
        break;
    }
    
    return `data:${mimeType};base64,${data.toString('base64')}`;
  } catch (error) {
    console.error(`Error convirtiendo ${imagePath}:`, error.message);
    return null;
  }
}

// Lista de imágenes a convertir (solo las más pequeñas y críticas)
const imagesToConvert = [
  {
    name: 'logoApp',
    path: 'public/images/logo-app.PNG',
    description: 'Logo de la aplicación'
  },
  {
    name: 'emojiHueso',
    path: 'public/images/Emoji hueso png.png',
    description: 'Emoji de hueso para moneda'
  },
];

// Generar archivo con constantes base64
function generateBase64Constants() {
  let output = `// Base64 encoded images for better performance\n`;
  output += `// Generated automatically by scripts/generateBase64.cjs\n`;
  output += `// Last updated: ${new Date().toISOString()}\n\n`;
  
  const base64Data = {};
  
  imagesToConvert.forEach(item => {
    console.log(`Convirtiendo ${item.description}...`);
    const base64 = imageToBase64(item.path);
    
    if (base64) {
      base64Data[item.name] = base64;
      const sizeKB = Math.round((base64.length * 0.75) / 1024); // Aproximado
      console.log(`✓ ${item.name}: ${sizeKB}KB en base64`);
    } else {
      console.log(`✗ Error convirtiendo ${item.name}`);
      base64Data[item.name] = '';
    }
  });
  
  output += `export const base64Images = {\n`;
  
  for (const [name, data] of Object.entries(base64Data)) {
    const item = imagesToConvert.find(i => i.name === name);
    output += `  // ${item.description}\n`;
    output += `  ${name}: '${data}',\n\n`;
  }
  
  output += `} as const;\n\n`;
  
  // Agregar funciones helper
  output += `// Función helper para crear URLs de datos desde base64\n`;
  output += `export function createDataUrl(base64: string, mimeType: string = 'image/png'): string {\n`;
  output += `  if (base64.startsWith('data:')) {\n`;
  output += `    return base64;\n`;
  output += `  }\n`;
  output += `  return \`data:\${mimeType};base64,\${base64}\`;\n`;
  output += `}\n\n`;
  
  output += `// Función para obtener imagen optimizada (base64 si está disponible, sino URL normal)\n`;
  output += `export function getOptimizedImage(imageName: keyof typeof base64Images, fallbackPath: string): string {\n`;
  output += `  const base64Data = base64Images[imageName];\n`;
  output += `  \n`;
  output += `  // Si la imagen base64 está vacía, usar el path normal\n`;
  output += `  if (!base64Data || base64Data === 'data:image/png;base64,' || base64Data === '') {\n`;
  output += `    return fallbackPath;\n`;
  output += `  }\n`;
  output += `  \n`;
  output += `  return base64Data;\n`;
  output += `}\n\n`;
  
  output += `// Función para precargar imágenes críticas (las que no están en base64)\n`;
  output += `export function preloadCriticalImages(): void {\n`;
  output += `  const criticalImages = [\n`;
  output += `    '/images/Heart.png',\n`;
  output += `    '/images/huesitos.png',\n`;
  output += `    '/images/Tienda.png',\n`;
  output += `    '/images/emoji llama.png',\n`;
  output += `    '/images/Descarte.png',\n`;
  output += `    '/images/Duplicar.png',\n`;
  output += `    '/images/Adrenalina.png',\n`;
  output += `    '/images/Inmunidad.png',\n`;
  output += `    '/images/Saltar.png',\n`;
  output += `  ];\n\n`;
  output += `  criticalImages.forEach(src => {\n`;
  output += `    const img = new Image();\n`;
  output += `    img.src = src;\n`;
  output += `  });\n`;
  output += `}\n`;
  
  return output;
}

// Ejecutar generación
console.log('🚀 Generando constantes Base64...\n');
const generated = generateBase64Constants();

// Escribir archivo
fs.writeFileSync('src/utils/imageBase64.ts', generated);
console.log('\n✅ Archivo generado: src/utils/imageBase64.ts');
console.log('📦 Las imágenes convertidas mejorarán el tiempo de carga inicial.');
