import { Fragment, type ReactNode } from 'react'

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g
  let last = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = regex.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++} className="text-navy-900 font-semibold">{match[1]}</strong>)
    } else if (match[2] !== undefined) {
      nodes.push(<em key={key++}>{match[2]}</em>)
    } else if (match[3] !== undefined && match[4] !== undefined) {
      nodes.push(<a key={key++} href={match[4]} className="text-gold-600 underline hover:text-navy-900 transition-colors">{match[3]}</a>)
    } else if (match[5] !== undefined) {
      nodes.push(<code key={key++} className="font-mono text-sm bg-navy-50 text-navy-900 px-1.5 py-0.5 rounded">{match[5]}</code>)
    }
    last = regex.lastIndex
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let k = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) { i++; continue }

    if (line.startsWith('## ')) {
      blocks.push(<h2 key={k++}>{renderInline(line.slice(3).trim())}</h2>)
      i++
      continue
    }
    if (line.startsWith('### ')) {
      blocks.push(<h3 key={k++}>{renderInline(line.slice(4).trim())}</h3>)
      i++
      continue
    }
    if (line.startsWith('# ')) {
      blocks.push(<h1 key={k++}>{renderInline(line.slice(2).trim())}</h1>)
      i++
      continue
    }

    if (line.startsWith('> ')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2))
        i++
      }
      blocks.push(<blockquote key={k++}>{renderInline(quoteLines.join(' '))}</blockquote>)
      continue
    }

    if (/^[-*]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s/, ''))
        i++
      }
      blocks.push(
        <ul key={k++}>
          {items.map((it, idx) => <li key={idx}>{renderInline(it)}</li>)}
        </ul>
      )
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''))
        i++
      }
      blocks.push(
        <ol key={k++}>
          {items.map((it, idx) => <li key={idx}>{renderInline(it)}</li>)}
        </ol>
      )
      continue
    }

    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|[-*]\s|\d+\.\s|> )/.test(lines[i])) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length) {
      blocks.push(<p key={k++}>{renderInline(paraLines.join(' '))}</p>)
    }
  }

  return <Fragment>{blocks}</Fragment>
}
