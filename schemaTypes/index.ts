/**
 * schemaTypes/index.ts — All document types registered with Sanity Studio.
 *
 * Migration note
 * --------------
 * `resource` and `interview` are retained for backwards compatibility.
 * Once documents are migrated to the unified `post` schema (discriminated
 * by `contentType`), remove those two imports and update the array.
 */

import author       from './author'
import category     from './category'
import post         from './post'
import resource     from './resource'      // retained for backwards compat
import interview    from './interview'     // retained for backwards compat
import blockContent from './blockContent'
import settings     from './settings'
import work         from './work'
import testimonial  from './testimonial'
import client       from './client'
import practice     from './practice'
import teamMember   from './teamMember'

export const schemaTypes = [
  // Content
  post,
  resource,
  interview,
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
