import { useState, useEffect, useRef } from 'react';
import { getTodo, createTodo, updateTodo, deleteTodo, type GetTodoParams } from './services/todo';
import { showToast } from './config/ToastConfig';
import type { todoModel } from './types/todo';
import type { PaginationMetadata } from './types/pagination';

import { TodoCreate } from './components/TodoCreate';
import { TodoSearchList } from './components/TodoSearchList';

function App() {
  const [todos, setTodos] = useState<todoModel[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata>();
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Params states (đáp ứng đủ 4 tham số của API)
  const [searchQuery, setSearchQuery] = useState('');
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 5; // Để demo phân trang dễ hơn, giới hạn 5 item mỗi trang

  // Ngăn chặn gọi fetch 2 lần khi mount do strict mode + useEffect deps
  const isFirstRender = useRef(true);

  const fetchTodos = async (params: GetTodoParams) => {
    try {
      setFetching(true);
      const res = await getTodo(params);
      if (res.data) setTodos(res.data);
      if (res.pagination) setPagination(res.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  // Tự động reset page về 1 mỗi khi đổi filter tìm kiếm
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [searchQuery, completedFilter]);

  // Debounce và tự động gọi API khi thay đổi tham số
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTodos({
        title: searchQuery || undefined,
        completed: completedFilter,
        page,
        limit
      });
    }, 400); // 400ms debounce chống spam request
    return () => clearTimeout(timer);
  }, [searchQuery, completedFilter, page]);

  // Thêm mới
  const handleAdd = async (title: string, content: string) => {
    try {
      setLoadingAdd(true);
      await createTodo({ title, content });
      showToast('success', 'Created successfully');

      // Clear filters và quay về trang 1
      if (searchQuery !== '' || completedFilter !== undefined) {
        setSearchQuery('');
        setCompletedFilter(undefined);
        // useEffect setPage(1) sẽ trigger fetch tự động
      } else if (page !== 1) {
        setPage(1);
      } else {
        fetchTodos({ title: undefined, completed: undefined, page: 1, limit });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleToggle = async (todo: todoModel) => {
    try {
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
      await updateTodo(todo.id, { completed: !todo.completed });
    } catch (error) {
      fetchTodos({ title: searchQuery || undefined, completed: completedFilter, page, limit });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this Todo?")) return;
    try {
      setTodos(prev => prev.filter(t => t.id !== id));
      await deleteTodo(id);
      showToast('success', 'Deleted Todo');
    } catch (error) {
      fetchTodos({ title: searchQuery || undefined, completed: completedFilter, page, limit });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      {/* Khung giao diện: mở rộng chiều cao và chiều ngang để có chỗ hiển thị bộ lọc & phân trang */}
      <div className="w-full max-w-[500px] h-[800px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white z-10 flex-shrink-0">
          <h1 className="text-2xl font-extrabold text-gray-800 text-center tracking-tight">Task Management</h1>
        </div>

        <TodoCreate onAdd={handleAdd} loading={loadingAdd} />

        <TodoSearchList
          todos={todos}
          pagination={pagination}
          fetching={fetching}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          completedFilter={completedFilter}
          onCompletedFilterChange={setCompletedFilter}
          onPageChange={setPage}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />

      </div>
    </div>
  );
}

export default App;
