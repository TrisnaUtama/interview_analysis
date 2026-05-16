export const ENDPOINTS = {
    AUTH: {
        sign: "auth/google",
        me: "auth/me",
        logout: "auth/logout"
    },
    RESUME: {
        get_all: "resumes",
        get_one: "resumes/{id}",
        upload: "resumes",
        delete: "resumes/{id}",
    }
}