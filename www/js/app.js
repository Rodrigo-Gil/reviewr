
const app = {
    reviews: [],
    KEY: null,
    lastId: "",

    init: () => {
      //set key based on device id
      app.KEY = "RodrigoReviewr" + device.uuid;
      //if localStorage contains reviews
      if (localStorage){
        //retrieve items from localStorage
        app.getReviews();
        //adding listeners to the review list
        let listItems = document.querySelectorAll(".list-item");
        listItems.forEach(el => el.addEventListener('click', app.getDetails)); 
      };  
      //add click listeners for navigation
      app.addListeners();
      //start starts rating system
      app.starsRating();
    },
    getReviews: () => {
      //getting reviews from localStorage
      if (localStorage.getItem(app.KEY)){
        let str = localStorage.getItem(app.KEY);
        app.reviews = JSON.parse(str);
        //calling the functions to set elements on the page
        app.reviewList();
      };
  },
    setReviews: () => {
      //this is responsible for saving new reviews
      let newReview = {};
      let id =  Date.now();
      let title = document.querySelector("#name").value;
      let rating = document.querySelector('.stars').getAttribute('data-rating');
      let img = document.querySelector(".photo-form img").src;
      //adding the new properties into the object
      newReview.id = id;
      newReview.title = title;
      newReview.rating = rating;
      newReview.img = img;
      //pushing the newly created object into the reviews array
      if(title){
      app.reviews.push(newReview);
      //saving the updated array into the localStorage
      window.localStorage.setItem(app.KEY, JSON.stringify(app.reviews));
      //displaying a confirmation prompt message on the screen
      navigator.notification.alert("Awesome! Your review has been saved!", () => {
        //restart the app
        app.init();
        //cleaning the add page
        document.querySelector('#add').classList.remove('hasPhoto');
        //navigation to home page
        document.querySelector(".page.active").classList.remove("active");
        document.querySelector("#home").classList.add("active");
      },);
    } else {
      alert("Please insert a name, before saving!")
    }
    },
    addListeners: () => {
      //from home to details
      document.getElementById("btnAdd").addEventListener("click", app.nav);
      //from add to home
      document.getElementById("btnAddBack").addEventListener("click", app.nav);
      //from photoAdd to home
      document.getElementById("btnBackHome").addEventListener("click", app.nav);
      //setting up the camera on the app
      document.getElementById("btnTakePhoto").addEventListener('click', app.takePhoto);
      //adding a listener on the save button to set and save review
      document.querySelector("#btnSave").addEventListener('click', app.setReviews);
    },
    nav: (ev) => {
      let btn = ev.target;
      console.log(btn);
      let target = btn.getAttribute("data-target");
      console.log("Navigate to", target);
      document.querySelector(".page.active").classList.remove("active");
      document.getElementById(target).classList.add("active");
      //removing the photo on the add review page if a photo has already been taken.
      if (document.querySelector("#add").classList.toggle("hasPhoto")){
        document.querySelector("#add").classList.remove("hasPhoto");
      }
    },
    takePhoto: () => {
      let options = {
        quality: 80,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
        cameraDirection: Camera.Direction.BACK,
        targetWidth: 300,
        targetHeight: 400,
      };
      navigator.camera.getPicture(app.photoWorks, app.photoFails, options);
    },
    photoWorks:(imgURI) => {
      let img = document.querySelector("#photo");
      img.src = imgURI;
      document.querySelector('#add').classList.add('hasPhoto');
    },
    photoFails: (msg) => {
      alert("The picture cannot be taken: error:" + msg);
      console.log(msg);
    },
    starsRating: (ev) => {
      //function to add the stars rating system to the app.
      let stars = document.querySelectorAll(".star");
      stars.forEach((star) => {
        star.addEventListener('click', ((ev) => {
      let span = ev.currentTarget;
      let num= 0;
      let match = false;
      stars.forEach(function(star, index){
        if(match) {
          star.classList.remove('checked');
        }else{
          star.classList.add('checked');
        }
        if(star === span){
          match = true;
          num = index + 1;
        }
      });
      document.querySelector('.stars').setAttribute('data-rating', num );
        })
        )});
      //code to automatically set stars rating to the default value;
      let rating = parseInt(document.querySelector('.stars').getAttribute('data-rating'));
      let target = stars[rating - 1];
      target.dispatchEvent(new MouseEvent('click'));
    },
    reviewList: (ev) => {
      //selecting the home page
      let page = document.querySelector('#home main');
      //cleaning the home page.
      page.innerHTML= "";
      //creating elements on the page
      let div = document.createElement('div');
      let pageTitle = document.createElement('h1');
      let newP =document.createElement('p');
      //inserting the contents on the elements on the page
      pageTitle.textContent = "Welcome to Reviewr";
      newP.textContent = "Select a review from the list to start. To add a new review, click on the + ADD button.";
      div.classList.add("review-list");
      //iterating through the reviews array to build the elements on the page.
      app.reviews.forEach((item) => {
        //creating elements for each item on the list
        let divReview= document.createElement('div');
        let title = document.createElement('h3');
        //inserting the title of each element on the review and id
        title.textContent = item.title;
        //creating a data key on each element and a data-target.
        divReview.setAttribute('data-key', item.id);
        //setting a class for each item on the list
        divReview.classList.add("list-item");
        //appending each review on the page
        divReview.append(title);
        div.append(divReview);
      });

      //appending elements on the page
      page.append(pageTitle);
      page.append(newP);
      page.append(div);
    },
    getDetails: (ev) => {
      let clickedReview = ev.target;
      console.log("getDetails activated");
      //creating elements on the page
      let details = document.querySelector("#details");
      let main = document.querySelector("#details main");
      //cleaning the old elements on the page
      main.innerHTML = "";
      //navigation to the page.
      document.querySelector(".page.active").classList.remove("active");
      details.classList.add("active");
      //getting the data key on the array
      let dataKey = clickedReview.closest("[data-key]");
      if (dataKey){
        let id = parseInt(dataKey.getAttribute('data-key'));
        //saving the id of the last review in a global variable
        app.lastId = id;
        console.log(app.lastId);
        //matching the id of the clicked elements in the array
        app.reviews.find((item) => {
          if (item.id === id){
            console.log(item.id);
            //creating the elements on the page
            let divItem = document.createElement("div");
            let figure = document.createElement("figure");
            let imgItem = document.createElement("img");
            let imgTitle = document.createElement("figcaption");
            let rating = document.createElement('p');
            let deleteBtn = document.createElement("button");
            let backBtn = document.createElement("button");
            //adding properties inside the elements
            imgItem.src = item.img;
            imgTitle.textContent = "Item: " + item.title;
            rating.textContent = "Rating: " + item.rating;
            deleteBtn.textContent= "delete";
            backBtn.textContent = "Cancel";
           
            //adding classes to the elements
            imgItem.classList.add("my_photo");
            divItem.classList.add("details_container");
            deleteBtn.classList.add("js_buttons");
            backBtn.classList.add("js_buttons");
            backBtn.setAttribute('data-target', 'home');
            //appending the elements inside the div
            figure.append(imgItem);
            figure.append(imgTitle);
            divItem.append(figure);
            divItem.append(rating);
            divItem.append(deleteBtn);
            divItem.append(backBtn);
            //appending all elements inside the page
            main.append(divItem);
            details.append(main);
            //Delete Button Event
            deleteBtn.addEventListener('click', app.deleteReview);
            backBtn.addEventListener('click', app.nav)
          }});
        }
    },
    deleteReview: (ev) => {
      //process to confirm the dialog result and delete the object
      function onConfirm (buttonIndex){
        if (buttonIndex == 1){
          let IndexArr = app.reviews.findIndex(element => element.id === app.lastId);
          app.reviews.splice(IndexArr, 1);
          alert ('Your review has been deleted!');        
          localStorage.setItem(app.KEY, JSON.stringify(app.reviews));
          //reloading the app
          app.init();
          //navigating to the home page
          document.querySelector(".page.active").classList.remove("active");
          document.querySelector("#home").classList.add("active");
        }
      }
      //calling a confirmation prompt
      navigator.notification.confirm("Do you really want to delete this review?", onConfirm, "Important!", "Yes, No");
    }
      };
  const ready = "cordova" in window ? "deviceready" : "DOMContentLoaded";
  document.addEventListener('deviceready', app.init);