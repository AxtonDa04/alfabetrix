const API_BASE = "http://localhost/alfabetrix/api/v1";

export async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error API");
    }

    return data;
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
}

export default {
	
	request,

  getModules() {
    return request("/modules/");
  },

  getActivities(moduleId=null){

    let url="/activities/";

    if(moduleId){
      url+=`?module_id=${moduleId}`;
    }

    return request(url);

  }

};