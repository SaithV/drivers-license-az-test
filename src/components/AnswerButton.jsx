import clsx from 'clsx'

export default function AnswerButton({
  index,
  children,
  disabled,
  onClick,
  state, // 'idle' | 'correct' | 'wrong' | 'revealed'
  isSelected,
}) {
  const base = 'w-full text-left px-4 py-4 rounded-xl font-medium shadow-md transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 active:scale-[.98]';
  const palette = {
    idle: 'bg-indigo-600/90 hover:bg-indigo-600 text-white',
    correct: 'bg-green-600 text-white scale-[1.01]',
    wrong: 'bg-red-600 text-white',
    revealed: 'bg-indigo-400 text-white'
  }
  const border = isSelected ? 'ring-2 ring-offset-2 ring-indigo-300 dark:ring-indigo-500' : ''
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isSelected}
      onClick={onClick}
      className={clsx(base, palette[state||'idle'], border, disabled && 'opacity-90 cursor-default')}
    >
      <div className="flex items-start gap-3">
        <span className="flex-none w-7 h-7 inline-flex items-center justify-center rounded-full bg-black/20 text-xs font-semibold">
          {String.fromCharCode(65+index)}
        </span>
        <span className="flex-1 leading-snug">{children}</span>
      </div>
    </button>
  )
}
