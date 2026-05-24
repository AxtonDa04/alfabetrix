import api from "./apiClient";

export async function getModules() {
    const response = await api.getModules();
    return response.data;
}