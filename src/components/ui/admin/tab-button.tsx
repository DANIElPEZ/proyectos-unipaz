interface Props {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}

export default function TabButton({ children, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 rounded-t-lg px-4 py-2 text-sm font-medium transition
        ${
          active
            ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
    >
      {children}
    </button>
  )
}
