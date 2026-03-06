import { API_BASE } from '@/utils/config';

export interface UserItemDetails {
    user_id: number;
    username: string;
    email: string;
    contact_name: string;
    company_name: string;
    address: string;
    phone_number: string;
    brand_names: string;
    product_categories: string;
    other_product_details: string;
    marketing_source: string;
    marketing_source_detail: string;
    status: 'active' | 'pending' | 'inactive';
    created_at: string;
}

export interface GetUsersResponse {
    status: string;
    message: string;
    data: {
        users: UserItemDetails[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            total_pages: number;
        };
    };
}

/**
 * Fetches all registered users for the admin dashboard
 */
export const getAllUsers = async (params: { 
    page?: number; 
    limit?: number | 'all'; 
    search?: string;
    start_date?: string;
    end_date?: string;
    status?: string | 'all';
} = {}): Promise<GetUsersResponse> => {
    const queryParams = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 20).toString(),
        search: params.search || '',
        start_date: params.start_date || '',
        end_date: params.end_date || '',
        status: params.status || '',
    });
    
    const res = await fetch(`${API_BASE}/users/get_users.php?${queryParams.toString()}`, {
        credentials: 'include',
    });
    return await res.json();
};
