import api from "./apiClient";

export async function getProfiles() {
  const response = await api.request("/profiles/");
  return response.data;
}

export async function createProfile(profileData) {
  return await api.request("/profiles/", {
    method: "POST",
    body: JSON.stringify(profileData),
  });
}

export async function deleteProfile(profileId) {
  if (!profileId) {
    throw new Error("No se recibió el ID del perfil a eliminar.");
  }

  return await api.request(`/profiles/?id=${encodeURIComponent(profileId)}`, {
    method: "DELETE",
  });
}
