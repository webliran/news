var CACHE_VERSION = 5;


self.addEventListener('fetch', function(event) {
    console.log('Handling fetch event for', event.request.url);
  
    event.respondWith(
      
      // Opens Cache objects that start with 'font'.
      caches.open('site_cache_' + CACHE_VERSION).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          if (response) {
            console.log('Found response in cache:', response);
  
            return response;
          }
  
          console.log('Fetching request from the network');
  
          return fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
  
            return networkResponse;
          });
        }).catch(function(error) {
          
          // Handles exceptions that arise from match() or fetch().
          console.error('Error in fetch handler:', error);
  
          throw error;
        });
      })
    );
  });