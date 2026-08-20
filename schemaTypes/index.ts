/**
 * schemaTypes/index.ts — All document types registered with Sanity Studio.
 */

import author                  from './author'
import workCategory            from './workCategory'
import resource                from './resource'
import edtechMentor            from './edtechMentor'
import edtechMarketingService  from './edtechMarketingService'
import blockContent            from './blockContent'
import seo                     from './seo'
import settings                from './settings'
import work                    from './work'
import testimonial             from './testimonial'
import client                  from './client'
import edtechMarketingPractice from './edtechMarketingPractice'
import team                    from './team'

export const schemaTypes = [
  // Content
  resource,
  edtechMentor,
  work,

  // Editorial
  testimonial,
  client,
  edtechMarketingPractice,
  edtechMarketingService,
  team,

  // Supporting
  author,
  workCategory,
  blockContent,
  seo,

  // Global
  settings,
]
