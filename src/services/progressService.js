import api from "./apiClient";

export async function getProgress({ userProfileId = null, moduleId = null } = {}) {
  const params = new URLSearchParams();

  if (userProfileId) {
    params.append("user_profile_id", userProfileId);
  }

  if (moduleId) {
    params.append("module_id", moduleId);
  }

  const query = params.toString();
  const response = await api.request(`/progress/${query ? `?${query}` : ""}`);

  return response.data;
}

export async function saveProgress(progressData) {
  const response = await api.request("/progress/", {
    method: "POST",
    body: JSON.stringify(progressData),
  });

  return response.data;
}
