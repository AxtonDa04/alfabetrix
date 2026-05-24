import api from "./apiClient";

export async function getActivityOptions(activityId) {
  const response = await api.request(`/activity-options/?activity_id=${activityId}`);
  return response.data;
}
