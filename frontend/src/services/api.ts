import { API, Auth } from "aws-amplify";
import { CrudPayload } from "../model/types";

export const projectsCrud = (payload: CrudPayload) => {
	return Auth.currentSession().then((res) => {
		return API.post("base_url", "/projects", {
			body: payload,
			headers: {
				"Content-Type": "application/json",
				Authorization: res.getIdToken().getJwtToken(),
			},
		});
	});
};

export const IssuesCrud = (payload: CrudPayload) => {
	return Auth.currentSession().then((res) => {
		return API.post("base_url", "/issues", {
			body: payload,
			headers: {
				"Content-Type": "application/json",
				Authorization: res.getIdToken().getJwtToken(),
			},
		});
	});
};

export const SprintsCrud = (payload: CrudPayload) => {
	return Auth.currentSession().then((res) => {
		return API.post("base_url", "/sprints", {
			body: payload,
			headers: {
				"Content-Type": "application/json",
				Authorization: res.getIdToken().getJwtToken(),
			},
		});
	});
};

export const commonCrud = (payload: CrudPayload) => {
	return Auth.currentSession().then((res) => {
		return API.post("base_url", "/common", {
			body: payload,
			headers: {
				"Content-Type": "application/json",
				Authorization: res.getIdToken().getJwtToken(),
			},
		});
	});
};

export const commonChildCrud = (payload: CrudPayload) => {
	return Auth.currentSession().then((res) => {
		return API.post("base_url", "/commonChild", {
			body: payload,
			headers: {
				"Content-Type": "application/json",
				Authorization: res.getIdToken().getJwtToken(),
			},
		});
	});
};

export const projectCommonCrud = (payload: CrudPayload) => {
	return Auth.currentSession().then((res) => {
		return API.post("base_url", "/projectCommon", {
			body: payload,
			headers: {
				"Content-Type": "application/json",
				Authorization: res.getIdToken().getJwtToken(),
			},
		});
	});
};

export const projectCommonChildCrud = (payload: CrudPayload) => {
	return Auth.currentSession().then((res) => {
		return API.post("base_url", "/projectCommonChild", {
			body: payload,
			headers: {
				"Content-Type": "application/json",
				Authorization: res.getIdToken().getJwtToken(),
			},
		});
	});
};

export const searchUser = (searchText: string, cancelTokeCallback?: (promise: Promise<any>) => void) => {
    const promise = Auth.currentSession().then((res) => {
		return API.post("base_url", "/user/search", {
			body: {
                searchText
            },
			headers: {
				"Content-Type": "application/json",
				Authorization: res.getIdToken().getJwtToken(),
			},
		});
	});
    if (cancelTokeCallback) cancelTokeCallback(promise);
    return promise.then((res)=>{
        const body = JSON.parse(res.body);
        return body.data;
    });
}

export const inviteToProject = (args: {projectId: string; inviteEmails: string[];}) => {
    return Auth.currentSession().then((res) => {
		return API.post("base_url", "/project-service/invite", {
			body: {
                ...args
            },
			headers: {
				"Content-Type": "application/json",
				Authorization: res.getIdToken().getJwtToken(),
			},
		});
	});
}

export const newJoinerCall = (payload: any) => {
    return Auth.currentSession().then((res) => {
		return API.post("base_url", "/project-service/newjoiner", {
			body: {
                token: payload.token
            },
			headers: {
				"Content-Type": "application/json",
				Authorization: res.getIdToken().getJwtToken(),
			},
		});
	});
}

export const fetchJoinedProjects = (paload: any) => {
    return Auth.currentSession().then((res) => {
		return API.post("base_url", "/project-service/projects", {
			body: {
            },
			headers: {
				"Content-Type": "application/json",
				Authorization: res.getIdToken().getJwtToken(),
			},
		});
	});
}

export const fetchProjectPeople = (paload: any) => {
    return Auth.currentSession().then((res) => {
		return API.post("base_url", "/project-service/people", {
			body: {
                projectId: paload.projectId
            },
			headers: {
				"Content-Type": "application/json",
				Authorization: res.getIdToken().getJwtToken(),
			},
		});
	});
}