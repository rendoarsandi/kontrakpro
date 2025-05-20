const fs = require('fs');
const path = require('path');

const routes = [
  '/app/api/notifications/route.ts',
  '/app/dashboard/contracts/[id]/crm/page.tsx',
  '/app/dashboard/contracts/[id]/export/page.tsx',
  '/app/dashboard/contracts/[id]/sign/page.tsx',
  '/app/dashboard/contracts/[id]/page.tsx',
  '/app/dashboard/integrations/[id]/page.tsx',
  '/app/dashboard/contracts/[id]/analyze/page.tsx'
];

function addEdgeRuntime(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  if (!content.includes("export const runtime = 'edge'")) {
    // Check if file has 'use client' directive
    if (content.includes("'use client'")) {
      content = content.replace("'use client'", "'use client';\n\nexport const runtime = 'edge';");
    } else {
      content = `export const runtime = 'edge';\n\n${content}`;
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`Added Edge Runtime to: ${filePath}`);
  } else {
    console.log(`Edge Runtime already exists in: ${filePath}`);
  }
}

routes.forEach(addEdgeRuntime);
