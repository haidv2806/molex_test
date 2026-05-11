import type { todoModel } from '../types/todo';

interface Props {
  todo: todoModel;
  onToggle: (todo: todoModel) => void;
  onDelete: (id: number) => void;
}

export function TodoCard({ todo, onToggle, onDelete }: Props) {
  return (
    <div 
      className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 transition-all hover:shadow-md group ${todo.completed ? 'opacity-60 bg-gray-50' : ''}`}
    >
      <input 
        type="checkbox" 
        className="mt-1 w-5 h-5 text-green-500 rounded border-gray-300 focus:ring-green-500 cursor-pointer accent-green-500 flex-shrink-0"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />
      <div className="flex-1 min-w-0">
        <div className={`text-[15px] font-semibold text-gray-800 truncate transition-all ${todo.completed ? 'line-through text-gray-500' : ''}`}>
          {todo.title}
        </div>
        <div className="text-[13px] text-gray-500 mt-1 break-words line-clamp-2">
          {todo.content}
        </div>
      </div>
      <button 
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        onClick={() => onDelete(todo.id)}
        title="Delete"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  );
}
