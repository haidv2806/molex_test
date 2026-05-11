import axiosInstance from "../config/axiosInstance";
import type { todoModel } from "../types/todo";
import type { PaginationMetadata, PaginationQueryMetadata } from "../types/pagination";

// Params cho getTodo
export interface GetTodoParams {
    title?: todoModel['title'];
    completed?: todoModel['completed'];
    page?: PaginationQueryMetadata['page'];
    limit?: PaginationQueryMetadata['limit'];
}

// Payload cho createTodo
export interface CreateTodoPayload extends Pick<todoModel, 'title' | 'content'> { }

// Payload cho updateTodo
export interface UpdateTodoPayload {
    title?: todoModel['title'];
    content?: todoModel['content'];
    completed?: todoModel['completed'];
}

// ─── Các đầu API ─────────────────────────────────────────────────────────────

/**
 * Lấy danh sách todos có hỗ trợ phân trang và tìm kiếm
 */
export const getTodo = async (params?: GetTodoParams): Promise<{ data: todoModel[], pagination: PaginationMetadata }> => {
    const response = await axiosInstance.get('/todos', { params });
    return {
        data: response.data?.data,
        pagination: response.data?.pagination
    }
}

/**
 * Thêm mới một todo
 */
export const createTodo = async (payload: CreateTodoPayload): Promise<{ data: todoModel }> => {
    const response = await axiosInstance.post('/todos', payload);
    return {
        data: response.data?.data
    }
}

/**
 * Cập nhật một todo theo ID
 */
export const updateTodo = async (id: number, payload: UpdateTodoPayload): Promise<{ data: todoModel }> => {
    const response = await axiosInstance.put(`/todos/${id}`, payload);
    return {
        data: response.data?.data
    }
}

/**
 * Xoá một todo theo ID
 */
export const deleteTodo = async (id: number): Promise<{ success: boolean }> => {
    const response = await axiosInstance.delete(`/todos/${id}`);
    return {
        success: response.data?.success
    }
}
