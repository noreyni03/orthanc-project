// src/cornerstone-declarations.d.ts

// Pour cornerstone-core
declare module 'cornerstone-core' {
  const cornerstone: any; // Vous pouvez affiner ce type plus tard si nécessaire
  export = cornerstone;
}

// Pour cornerstone-tools
declare module 'cornerstone-tools' {
  const cornerstoneTools: any; // Vous pouvez affiner ce type plus tard si nécessaire
  export = cornerstoneTools;
}

// Pour cornerstone-wado-image-loader
declare module 'cornerstone-wado-image-loader' {
  const cornerstoneWADOImageLoader: any; // Vous pouvez affiner ce type plus tard si nécessaire
  export = cornerstoneWADOImageLoader;
}

// Pour dicom-parser (si elle n'exporte pas ses types, ce qui semble être le cas)
// Si dicom-parser exporte ses propres types mais que TS ne les trouve pas, 
// cette déclaration peut quand même aider.
declare module 'dicom-parser' {
  const dicomParser: any; // Vous pouvez affiner ce type plus tard si nécessaire
  export = dicomParser;
}

// Pour HammerJS (si @types/hammerjs a été installé avec succès)
// Si @types/hammerjs a été installé, cette déclaration n'est normalement pas nécessaire.
// Mais si vous avez encore des problèmes avec HammerJS, vous pouvez l'ajouter :
// declare module 'hammerjs' {
//   const Hammer: any;
//   export = Hammer;
// }
// Cependant, `@types/hammerjs` devrait exister et fonctionner. S'il n'est pas installé, installez-le :
// npm install --save-dev @types/hammerjs