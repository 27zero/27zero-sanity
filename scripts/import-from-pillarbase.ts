#!/usr/bin/env ts-node
/**
 * scripts/import-from-pillarbase.ts
 *
 * CLI script to import posts from Pillarbase into Sanity.
 *
 * Usage
 * ─────
 *   # Import a single post by Pillarbase ID
 *   npx ts-node scripts/import-from-pillarbase.ts --id abc123
 *
 *   # Import and immediately publish
 *   npx ts-node scripts/import-from-pillarbase.ts --id abc123 --publish
 *
 *   # List available posts from Pillarbase
 *   npx ts-node scripts/import-from-pillarbase.ts --list
 *
 *   # Import all published posts from Pillarbase
 *   npx ts-node scripts/import-from-pillarbase.ts --all
 *
 *   # Import all and publish
 *   npx ts-node scripts/import-from-pillarbase.ts --all --publish
 *
 * Environment
 * ───────────
 * Copy .env.example to .env and fill in your credentials.
 * The script loads .env automatically via dotenv.
 */

// Load .env before importing anything else
import 'dotenv/config'

import {getPosts} from '../src/integrations/pillarbase'
import {importPost, importPosts} from '../src/importPost'

// ── CLI argument parsing ──────────────────────────────────────────────────────

const args = process.argv.slice(2)

function hasFlag(flag: string): boolean {
  return args.includes(flag)
}

function getFlagValue(flag: string): string | undefined {
  const idx = args.indexOf(flag)
  return idx !== -1 ? args[idx + 1] : undefined
}

const shouldList    = hasFlag('--list')
const shouldImportAll = hasFlag('--all')
const singleId      = getFlagValue('--id')
const publish       = hasFlag('--publish')
const help          = hasFlag('--help') || hasFlag('-h') || args.length === 0

// ── Help ──────────────────────────────────────────────────────────────────────

if (help) {
  console.log(`
Pillarbase → Sanity importer

Usage:
  npx ts-node scripts/import-from-pillarbase.ts [options]

Options:
  --list              List available posts from Pillarbase
  --id <post-id>      Import a single post by Pillarbase ID
  --all               Import all posts from Pillarbase
  --publish           Publish imported posts immediately (skip draft state)
  --help, -h          Show this help

Examples:
  npx ts-node scripts/import-from-pillarbase.ts --list
  npx ts-node scripts/import-from-pillarbase.ts --id abc123
  npx ts-node scripts/import-from-pillarbase.ts --id abc123 --publish
  npx ts-node scripts/import-from-pillarbase.ts --all --publish
`)
  process.exit(0)
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (shouldList) {
    // ── List posts ────────────────────────────────────────────────────────────
    console.log('Fetching posts from Pillarbase…\n')
    const {data, total} = await getPosts({perPage: 50})

    if (data.length === 0) {
      console.log('No posts found.')
      return
    }

    console.log(`Found ${total} post(s):\n`)
    for (const post of data) {
      console.log(`  ${post.id.padEnd(24)} ${post.status?.padEnd(12) ?? 'unknown'.padEnd(12)} ${post.title}`)
    }

    return
  }

  if (singleId) {
    // ── Import single ─────────────────────────────────────────────────────────
    console.log(`Importing post ${singleId}…\n`)
    const result = await importPost({
      pillarbaseId: singleId,
      publishImmediately: publish,
    })

    if (result.success) {
      console.log(`\n✅ Success`)
      console.log(`   Title:     ${result.title}`)
      console.log(`   Sanity ID: ${result.sanityId}`)
      console.log(`   Slug:      ${result.slug}`)
      console.log(`   Status:    ${result.published ? 'published' : 'draft'}`)
    } else {
      console.error(`\n❌ Failed: ${result.error}`)
      process.exit(1)
    }

    return
  }

  if (shouldImportAll) {
    // ── Import all ────────────────────────────────────────────────────────────
    console.log('Fetching all posts from Pillarbase…\n')

    const allIds: string[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const {data, has_more} = await getPosts({page, perPage: 50, status: 'published'})
      allIds.push(...data.map(p => p.id))
      hasMore = has_more
      page++
    }

    if (allIds.length === 0) {
      console.log('No published posts found in Pillarbase.')
      return
    }

    console.log(`Found ${allIds.length} post(s) to import.\n`)

    const results = await importPosts(allIds, {publishImmediately: publish})

    const successes = results.filter(r => r.success)
    const failures  = results.filter(r => !r.success)

    console.log(`\n── Summary ──────────────────────────────────────`)
    console.log(`  ✅ ${successes.length} imported successfully`)
    if (failures.length > 0) {
      console.log(`  ❌ ${failures.length} failed:`)
      failures.forEach(f => {
        if (!f.success) console.log(`     ${f.pillarbaseId}: ${f.error}`)
      })
      process.exit(1)
    }

    return
  }

  // No recognised flag
  console.error('No action specified.  Run with --help to see available options.')
  process.exit(1)
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
