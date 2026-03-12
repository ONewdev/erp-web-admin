import { API_BASE } from '@/utils/config';

export interface PopupItem {
    id: number;
    welcome_img: string;
    show_status: number;
    created_at: string;
}

export interface FetchPopupsResponse {
    status: string;
    message?: string;
    data: PopupItem[];
}

export interface BasePopupResponse {
    status: string;
    message?: string;
}

/**
 * Fetches the list of all welcome popups
 */
export const getWelcomePopups = async (): Promise<FetchPopupsResponse> => {
    const res = await fetch(`${API_BASE}/welcome-popup/index.php`, {
        method: 'GET',
        credentials: 'include',
    });
    return await res.json();
};

/**
 * Uploads a new welcome popup image
 */
export const createWelcomePopup = async (formData: FormData): Promise<BasePopupResponse> => {
    const res = await fetch(`${API_BASE}/welcome-popup/create.php`, {
        method: 'POST',
        body: formData,
        headers: {
            // 'Content-Type': 'multipart/form-data',
        },
        credentials: 'include',
    });
    return await res.json();
};

/**
 * Toggles the active status of a welcome popup
 */
export const toggleWelcomePopup = async (id: number): Promise<BasePopupResponse> => {
    const res = await fetch(`${API_BASE}/welcome-popup/toggle.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
        credentials: 'include',
    });
    return await res.json();
};

/**
 * Deletes a welcome popup
 */
export const deleteWelcomePopup = async (id: number): Promise<BasePopupResponse> => {
    const res = await fetch(`${API_BASE}/welcome-popup/delete.php?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    return await res.json();
};
