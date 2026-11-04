interface Option<T> {
  value: T
  label: string
}

interface SegmentedProps<T> {
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

export function Segmented<T extends string>({ label, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div className="control" role="group" aria-label={label}>
      <span className="control-label">{label}</span>
      <div className="control-options">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="pill"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
