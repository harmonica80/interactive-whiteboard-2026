import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const whiteboardFiles = ['whiteboard_v146.html', 'whiteboard.html']

for (const file of whiteboardFiles) {
  const html = readFileSync(file, 'utf8')
  const moduleMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/)

  if (!moduleMatch) {
    throw new Error(`${file} does not contain a module script`)
  }

  const result = spawnSync(process.execPath, ['--input-type=module', '--check', '-'], {
    input: moduleMatch[1],
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    process.stderr.write(`Module syntax check failed for ${file}\n${result.stderr}`)
    process.exit(result.status ?? 1)
  }

  console.log(`✓ ${file}`)
}