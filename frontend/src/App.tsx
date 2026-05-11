import { useState, useEffect } from 'react';
import { getTodo, createTodo, updateTodo, deleteTodo } from './services/todo';
import { showToast } from './config/ToastConfig';
import type { todoModel } from './types/todo';

function App() {
  const [todos, setTodos] = useState<todoModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Lấy dữ liệu
  const fetchTodos = async () => {
    try {
      setFetching(true);
      const res = await getTodo();
      if (res.data) {
        setTodos(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Thêm Todo
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setLoading(true);
      await createTodo({ title, content });
      showToast('success', 'Thêm mới thành công');
      setTitle('');
      setContent('');
      fetchTodos(); // Refresh list
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Đổi trạng thái Completed
  const handleToggle = async (todo: todoModel) => {
    try {
      // Optimistic update
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
      await updateTodo(todo.id, { completed: !todo.completed });
    } catch (error) {
      fetchTodos();
    }
  };

  // Xoá Todo
  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xoá Todo này?")) return;
    try {
      // Optimistic update
      setTodos(prev => prev.filter(t => t.id !== id));
      await deleteTodo(id);
      showToast('success', 'Đã xoá Todo');
    } catch (error) {
      fetchTodos();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      {/* Khung giao diện cố định: rộng tối đa 450px, cao 700px, cố định layout */}
      <div className="w-full max-w-[450px] h-[700px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header cố định */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white z-10 flex-shrink-0">
          <h1 className="text-2xl font-extrabold text-gray-800 text-center tracking-tight">✨ My Tasks</h1>
        </div>

        {/* Form thêm Todo cố định */}
        <div className="px-6 py-5 bg-gray-50/80 border-b border-gray-100 flex-shrink-0">
          <form className="flex flex-col gap-3" onSubmit={handleAdd}>
            <input 
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              placeholder="Tiêu đề (VD: Mua đồ ăn)" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              maxLength={50}
              required
            />
            <input 
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              placeholder="Nội dung chi tiết..." 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              maxLength={255}
              required
            />
            <button 
              type="submit" 
              className="w-full mt-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors shadow-md flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : 'Thêm Công Việc'}
            </button>
          </form>
        </div>

        {/* Danh sách Todo có scroll nội bộ (vùng này tự co giãn lấp đầy khoảng trống) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#f8fafc]">
          {fetching ? (
            <div className="text-center text-gray-400 mt-10 font-medium">Đang tải dữ liệu...</div>
          ) : (
            <div className="flex flex-col gap-3 pb-6">
              {todos.length === 0 ? (
                <div className="text-center text-gray-400 mt-10 font-medium">Bạn chưa có công việc nào. Thêm ngay nhé!</div>
              ) : (
                todos.map(todo => (
                  <div 
                    key={todo.id} 
                    className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 transition-all hover:shadow-md group ${todo.completed ? 'opacity-60 bg-gray-50' : ''}`}
                  >
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 text-green-500 rounded border-gray-300 focus:ring-green-500 cursor-pointer accent-green-500 flex-shrink-0"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
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
                      onClick={() => handleDelete(todo.id)}
                      title="Xoá"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default App;
