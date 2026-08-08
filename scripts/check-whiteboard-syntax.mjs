import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const activeWhiteboardFile = 'whiteboard_v146.html'
const html = readFileSync(activeWhiteboardFile, 'utf8')
const moduleMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/)

if (!moduleMatch) {
  throw new Error(`${activeWhiteboardFile} does not contain a module script`)
}

const result = spawnSync(process.execPath, ['--input-type=module', '--check', '-'], {
  input: moduleMatch[1],
  encoding: 'utf8',
})

if (result.status !== 0) {
  process.stderr.write(`Module syntax check failed for ${activeWhiteboardFile}\n${result.stderr}`)
  process.exit(result.status ?? 1)
}

console.log(`✓ ${activeWhiteboardFile}`)