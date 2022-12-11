import { API, Auth } from "aws-amplify"
import { CrudPayload } from "../model/types"

export const projectsCrud = (payload: CrudPayload) => {
    return Auth
        .currentSession()
        .then(res => {
            return API.post('base_url', '/projects', {
                body: payload,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': res.getIdToken().getJwtToken()
                }
            })
        })
}

export const IssuesCrud = (payload: CrudPayload) => {
    return Auth
        .currentSession()
        .then(res => {
            return API.post('base_url', '/issues', {
                body: payload,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': res.getIdToken().getJwtToken()
                }
            })
        })
}

export const SprintsCrud = (payload: CrudPayload) => {
    return Auth
        .currentSession()
        .then(res => {
            return API.post('base_url', '/sprints', {
                body: payload,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': res.getIdToken().getJwtToken()
                }
            })
        })
}

export const commonCrud = (payload: CrudPayload) => {
    return Auth
        .currentSession()
        .then(res => {
            return API.post('base_url', '/common', {
                body: payload,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': res.getIdToken().getJwtToken()
                }
            })
        })
}

export const commonChildCrud = (payload: CrudPayload) => {
    return Auth
        .currentSession()
        .then(res => {
            return API.post('base_url', '/commonChild', {
                body: payload,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': res.getIdToken().getJwtToken()
                }
            })
        })
}