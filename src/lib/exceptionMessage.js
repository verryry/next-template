export function axiosException(error) {
    let errorMessage = ''

    if (!error.response) {
        errorMessage = 'Cannot communicate with the server!'
    } else {
        errorMessage = 'Error Code: ' + error.response.data.status + '-' + error.response.data.detail;
    }

    return errorMessage
}


export default axiosException