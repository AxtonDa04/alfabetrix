import api from "./apiClient";

export async function getActivities(moduleId) {
    const response = await api.getActivities(moduleId);
    return response.data;
}