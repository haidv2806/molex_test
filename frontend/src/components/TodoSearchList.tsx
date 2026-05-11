import type { todoModel } from '../types/todo';
import { TodoCard } from './TodoCard';
import type { PaginationMetadata } from '../types/pagination';

interface Props {
  todos: todoModel[];
  pagination?: PaginationMetadata;
  fetching: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  completedFilter: boolean | undefined;
  onCompletedFilterChange: (val: boolean | undefined) => void;
  onPageChange: (page: number) => void;
  onToggle: (todo: todoModel) => void;
  onDelete: (id: number) => void;
}

export function TodoSearchList({ 
  todos, pagination, fetching, 
  searchQuery, onSearchChange, 
  completedFilter, onCompletedFilterChange,
  onPageChange,
  onToggle, onDelete 
}: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc]">
      {/* Thanh công cụ: Tìm kiếm & Lọc trạng thái */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0 flex gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
            placeholder="Tìm kiếm công việc..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm outline-none cursor-pointer"
          value={completedFilter === undefined ? 'all' : completedFilter ? 'completed' : 'active'}
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'all') onCompletedFilterChange(undefined);
            else if (val === 'completed') onCompletedFilterChange(true);
            else onCompletedFilterChange(false);
          }}
        >
          <option value="all">Tất cả</option>
          <option value="active">Chưa xong</option>
          <option value="completed">Đã xong</option>
        </select>
      </div>

      {/* Danh sách scroll được */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {fetching ? (
          <div className="text-center text-gray-400 mt-10 font-medium flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-6">
            {todos.length === 0 ? (
              <div className="text-center text-gray-400 mt-10 font-medium">
                {(searchQuery || completedFilter !== undefined) 
                  ? 'Không tìm thấy công việc phù hợp bộ lọc.' 
                  : 'Bạn chưa có công việc nào. Thêm ngay nhé!'}
              </div>
            ) : (
              todos.map(todo => (
                <TodoCard 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={onToggle} 
                  onDelete={onDelete} 
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Vùng Phân trang (Pagination) */}
      {pagination && pagination.total_items > 0 && (
        <div className="px-6 py-3 bg-white border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <span className="text-sm font-medium text-gray-500">
            Trang {pagination.current_page} / {pagination.total_pages} (Tổng {pagination.total_items})
          </span>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={pagination.current_page <= 1}
              onClick={() => onPageChange(pagination.current_page - 1)}
            >
              Trước
            </button>
            <button 
              className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={pagination.current_page >= pagination.total_pages}
              onClick={() => onPageChange(pagination.current_page + 1)}
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
