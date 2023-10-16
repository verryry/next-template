import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";


export const getHttpRequest = (baseUrl, store, url, key, refetchOnWindowFocus) => {
    return useQuery({
        queryFn: async () => {
            const result = await axios.get(baseUrl + url, {
                headers: {
                    Authorization: 'Bearer ' + store.getState().session.token
                }
            })
            return result
        },
        refetchOnWindowFocus,
        queryKey: [key],
    })
}

export const postHttpRequest = (baseUrl, store, url, { onSuccess }) => {
    return useMutation({
        mutationFn: async (body) => {
            try {
                const result = await axios.post(baseUrl + url, body, {
                    headers: {
                        Authorization: 'Bearer ' + store.getState().session.token
                    }
                })

                return result
            } catch (error) {
                console.log(e);
            }

        },
        onSuccess,
    })
}

export const putHttpRequest = (baseUrl, store, url, { onSuccess }) => {
    return useMutation({
        mutationFn: async (body) => {
            try {
                const result = await axios.put(baseUrl + url, body, {
                    headers: {
                        Authorization: 'Bearer ' + store.getState().session.token
                    }
                })

                return result
            } catch (error) {
                console.log(e);
            }

        },
        onSuccess,
    })
}

export const destroyHttpRequest = (baseUrl, store, url, { onSuccess }) => {
    return useMutation({
        mutationFn: async (id) => {
            try {
                const result = await axios.delete(baseUrl + url + `/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + store.getState().session.token
                    }
                })

                return result
            } catch (error) {
                console.log(e);
            }
        },
        onSuccess,
    })
}


// export const putHttpRequest = (baseUrl, store, url, { onSuccess }) => {
//     return useMutation({
//         mutationFn: async (body) => {
//             try {
//                 const result = await axios.put(baseUrl + url + `/${body.id}`, body, {
//                     headers: {
//                         Authorization: 'Bearer ' + store.getState().session.token
//                     }
//                 })

//                 return result
//             } catch (error) {
//                 console.log(e);
//             }

//         },
//         onSuccess,
//     })
// }

// export default function useHttpRequest(baseUrl, store, url, method = 'GET', key, refetchOnWindowFocus, onSuccess = {}, data = {}, oldData) {
//     key = key || ['id']
//     switch (method) {
//         case 'GET':
//             data = typeof data === 'object' ? '' : data
//             return getHttpRequest(baseUrl, store, url, key, refetchOnWindowFocus, data, oldData)

//             break;
//         case 'POST':
//             return postHttpRequest(baseUrl, store, url, key, onSuccess, data, oldData)

//             break;
//         default:
//             break;
//     }
// }
