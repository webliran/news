function getNews(url){
    return new Promise((resolve,reject) => {

        fetch(url, {
	    method: 'get'
        }).then(function(response) {
            resolve(response);
        }).catch(function(err) {
            reject(err);
        });


    })
}



  export default getNews;