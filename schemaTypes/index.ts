/**
 * schemaTypes/index.ts
 *
 * Registers all document types with Sanity Studio.
 *
 * Migration note
 * --------------
 * `resource` and `interview` are still registered here to avoid
 * breaking existing documents.  Once all documents are migrated
 * to the unified `post` schema with `contentType` discriminators,
 * remove those two imports and update the array.
 */

import author      from './author'
import category    from './category'
import post        from './post'
import resource    from './resource'      // retained for backwards compat
import interview   from './interview'     // retained for backwards compat
import blockContent from './blockContent'
import settings    from './settings'
import work        from './work'

export const schemaTypes = [
  // Content
  post,
  resource,
  interview,
  work,

  // Supporting
  author,
  category,
  blockContent,

  // Global
  settings,
]
