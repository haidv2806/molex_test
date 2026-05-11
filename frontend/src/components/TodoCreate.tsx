import { useState } from 'react';

interface Props {
  onAdd: (title: string, content: string) => Promise<void>;
  loading: boolean;
}

export function TodoCreate({ onAdd, loading }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await onAdd(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <div className="px-6 py-5 bg-gray-50/80 border-b border-gray-100 flex-shrink-0">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
  );
}
