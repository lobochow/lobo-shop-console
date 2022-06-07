export function request(options){
    let xhr = new XMLHttpRequest();
    let result = new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(xhr.status + ':' + xhr.statusText));
                }
            }
        }
    })

    xhr.open(options.method, options.url, true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(options.body));

    return result;
}

export const getCategory_1 = () => request({
    method: 'get',
    url: '/v1/category_1'
});

export const postUpdateC1 = (body) => request({
    method: 'post',
    url: '/v1/category_1',
    body
});

export const deleteCategory_1 = (body) => request({
    method: 'delete',
    url: '/v1/category_1',
    body
});

//c2
export const getCategory_2 = (c1_id) => request({
    method: 'get',
    url: `/v1/category_2?c1_id=${c1_id}`
});

export const postUpdateC2 = (body) => request({
    method: 'post',
    url: '/v1/category_2',
    body
});

export const deleteCategory_2 = (body) => request({
    method: 'delete',
    url: '/v1/category_2',
    body
});

//c3
export const postUpdateC3 = (body) => request({
    method: 'post',
    url: '/v1/category_3',
    body
});