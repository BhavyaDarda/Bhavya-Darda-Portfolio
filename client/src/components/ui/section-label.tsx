interface SectionLabelProps {
  index: string
  label: string
  align?: 'left' | 'right'
}

export function SectionLabel({ index, label, align = 'left' }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      <span className="h-px w-8 bg-cosmic-primary/50" />
      <span className="mono-label text-cosmic-primary/70">
        {index} / {label}
      </span>
    </div>
  )
}
