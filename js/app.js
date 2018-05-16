import  elem  from './elements.js';
import  getNews  from './news-feed.js';
import addElement from './create-new-feed.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    //navigator.serviceWorker.register('/sw.js');
  });
}

elem.pushButton.addEventListener("click",askForNotificationPermission)

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
firebase.auth().languageCode = 'he';

elem.loginButton.addEventListener("click",login)
function login(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
}

elem.logoutButton.addEventListener("click",logout)

function logout(){
  firebase.auth().signOut()
  .then(function() {
    // Sign-out successful.
  })
  .catch(function(error) {
    // An error happened
  });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        navigator.serviceWorker.ready.then(function(swgo){
            var options = {
              body: user.email,
            };
            swgo.showNotification("ברוך הבא!",options)
          })

        elem.loginButton.style.display = 'none';
        elem.logoutButton.innerHTML = 'שלום , ' + user.email;
        elem.logoutButton.style.display = 'block';
    } else {
        elem.logoutButton.style.display = 'none';
        elem.loginButton.style.display = 'block'; 
    }
  });

getNews('https://newsapi.org/v2/top-headlines?country=il&apiKey=fff8f9c410e74e61bff0714e342f3688').then((res) => {
   return res.json()
}).then((data) => {

    for (let key in data.articles) {
       // console.log(data.articles[key])
        addElement(data.articles[key]);
    }

});

function askForNotificationPermission() {


    Notification.requestPermission(function(result) {
      console.log('User Choice', result);
      if (result !== 'granted') {
        
      } else {
      
        addPushSub();
      }
    });
  }

  function addPushSub(){
      if(!('serviceWorker' in navigator))
      return;

      var reg;
      navigator.serviceWorker.ready
        .then((swreg) =>{
          reg = swreg;
          return swreg.pushManager.getSubscription()
        })
        .then((sub)=>{
          if(sub === null){
            console.log(sub);
            var vapidPublicKey = 'BDuWcY23x1ebY4S0uvD8sNPPgoZlIBtyIZpNrnUzbNA5ABAyE7OduW9_uWB1OJH8NTTukoSomt6UGy0ZtF-XsM8';
            var realKey = urlBase64ToUint8Array(vapidPublicKey);
            return reg.pushManager.subscribe({
              userVisibleOnly : true,
              applicationServerKey : realKey
            });
          }
          else{
            return sub;
          }
        })
        .then((newsub) => {
          console.log(newsub)
          return fetch("https://news-d8291.firebaseio.com/subscribers.json",{
            method : "POST",
            headers: {
              "Content-Type" : "application/json",
              "Accept" : "application/json"
            },
            body: JSON.stringify(newsub)
          })
          
        })
        .then((fetchRes) => {
          console.log("done",fetchRes)
        })
  }

  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
  
    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }