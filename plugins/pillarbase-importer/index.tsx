/**
 * plugins/pillarbase-importer/index.tsx
 *
 * Registers the Pillarbase Importer as a Studio nav-bar tool.
 *
 * Usage in sanity.config.ts:
 *   import {pillarbaseImporterPlugin} from './plugins/pillarbase-importer'
 *   plugins: [..., pillarbaseImporterPlugin()]
 */

import React from 'react'
import {definePlugin} from 'sanity'
import {PillarbaseImporter} from './PillarbaseImporter'

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  )
}

export const pillarbaseImporterPlugin = definePlugin({
  name: 'pillarbase-importer',
  tools: [{
    name: 'pillarbase-importer',
    title: 'Pillarbase Importer',
    icon: UploadIcon,
    component: PillarbaseImporter,
  }],
})
