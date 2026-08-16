/**
 * schemaTypes/index.ts — All document types registered with Sanity Studio.
 *
 * Migration note
 * --------------
 * `resource` is retained for backwards compatibility.
 */

import author       from './author'
import category     from './category'
import resource     from './resource'      // retained for backwards compat
import edtechMentor from './edtechMentor'
import blockContent from './blockContent'
import settings     from './settings'
import work         from './work'
import testimonial  from './testimonial'
import client       from './client'
import practice     from './practice'
import teamMember   from './teamMember'

export const schemaTypes = [
  // Content
  resource,
  edtechMentor,
  work,

  // Editorial
  testimonial,
  client,
  practice,
  teamMember,

  // Supporting
  author,
  category,
  blockContent,

  // Global
  settings,
]
