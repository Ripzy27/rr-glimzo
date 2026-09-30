import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  optional?: boolean
  wide?: boolean
  children: ReactNode
}

export function Field({ label, optional, wide, children }: FieldProps) {
  return (
    <label className={wide ? 'field wide' : 'field'}>
      {label}
      {optional && <> <span>(optional)</span></>}
      {children}
    </label>
  )
}

/** A placeholder option followed by one option per value. */
export function Options({ placeholder, values }: { placeholder: string; values: readonly string[] }) {
  return (
    <>
      <option value="">{placeholder}</option>
      {values.map(value => (
        <option key={value}>{value}</option>
      ))}
    </>
  )
}
