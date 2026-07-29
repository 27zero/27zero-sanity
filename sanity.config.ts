import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {pillarbaseImporterPlugin} from './plugins/pillarbase-importer'

export default defineConfig({
  name: 'default',
  title: '27zero-cms',

  projectId: 'u9sntfl9',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    // Pillarbase Importer — adds "Pillarbase Importer" tab to the Studio nav bar
    // Requires SANITY_STUDIO_PILLARBASE_API_URL and SANITY_STUDIO_PILLARBASE_API_KEY in .env
    pillarbaseImporterPlugin(),
  ],

  schema: {
    types: schemaTypes,
  },
})
