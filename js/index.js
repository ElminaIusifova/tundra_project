const KEY = 'IUSI0001'; //session storage needs a key - username

let app = {

    URL: 'http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender',
    imgBaseURL: "",
    names: [],
    list: [],


    init: function () { // init function  is always list of objects
        app.getData();

        document.getElementById("favorite").addEventListener("click", app.favPage);
        document.getElementById("home").addEventListener("click", app.homePage);

    },





    getData: function (firstTime = true) {
        fetch(app.URL) //fetching the data inside the getData fucntion so that we can call it  anytime
            .then((response) => {
                return response.json();
            })
            .then((data) => { // passing json to the data parametre
                app.names = app.names.concat(data.profiles); // joining created empty array with array from data so that it became one array!!
                app.imgBaseURL = decodeURIComponent(data.imgBaseURL);
                console.log(app.names);
                if (firstTime) {
                    app.createCard(app.names);
                } else {
                    app.addCard(data.profiles);
                }
            })
            .catch((err) => {
                console.log('ERROR:', err.message);
            });

    },


    //CREATING CARD ON THE FIRST PAGE
    createCard: function (names) {
        let page = document.querySelector("#activePages .content"); // targeting from html
        let doc = document.createDocumentFragment(); // creating container for the card
        names.forEach(name => {

            let div = document.createElement('div');
            div.className = "card fixed top"; // giving classname to the div of the cards
            div.setAttribute("id", name.id); // giving id  to the div of the cards
            let img = document.createElement("img");
            img.setAttribute("src", app.imgBaseURL + "/" + name.avatar);
            let p = document.createElement("p");
            let p1 = document.createElement("p");
            let h = document.createElement("h1");
            h.textContent = name.first + " " + name.last; // displaying first and last names in h
            p.textContent = name.gender; // displaying gender  in p
            p1.textContent = name.distance; // displaying distance in p1
            div.appendChild(h); // inserting h inside the div 
            div.appendChild(img); // inserting img inside the div
            div.appendChild(p); //inserting p inside the div
            div.appendChild(p1); // inserting p1 inside the div



            let tiny = new t$(div);
            tiny.addEventListener(t$.EventTypes.SWIPERIGHT, app.storeData); // SWIPING AND CALLING StoreData function
            tiny.addEventListener(t$.EventTypes.SWIPELEFT, app.deleteData); // SWIPING RIGHT and deleting cards

            doc.appendChild(div); // inserting whole div inside the document

        });
        page.appendChild(doc); // inserting doc on the page

        app.showCards();
    },
    addCard: function (names) {
        let page = document.querySelector("#activePages .content");
        let doc = document.createDocumentFragment();
        names.forEach(name => {

            let div = document.createElement('div');
            div.className = "card fixed top";
            div.setAttribute("id", name.id);
            let img = document.createElement("img");
            img.setAttribute("src", app.imgBaseURL + "/" + name.avatar);
            let p = document.createElement("p");
            let p1 = document.createElement("p");
            let h = document.createElement("h1");
            h.textContent = name.first + " " + name.last;
            p.textContent = name.gender;
            p1.textContent = name.distance;
            div.appendChild(h);
            div.appendChild(img);
            div.appendChild(p);
            div.appendChild(p1);



            let tiny = new t$(div);
            tiny.addEventListener(t$.EventTypes.SWIPERIGHT, app.storeData);
            tiny.addEventListener(t$.EventTypes.SWIPELEFT, app.deleteData);

            doc.appendChild(div);

        });
        page.appendChild(doc);

        //app.showCards();
    },
    showCards: function () {
        app.showNext();
        //        allCards.forEach(allCard => { // looping through cards
        //            setTimeout(() => { //immidiate action
        //                allCard.classList.remove("top"); //removing "top" position once they are slided down to the screen
        //            }, 500)
        //        });
    },

    deleteData: function (ev) { // deleting cards with SWIPING left
        let currentCard = ev.currentTarget; //event listener for particular swiped  card
        currentCard.classList.remove("active");
        currentCard.classList.add("left");
        setTimeout( (function(card){
            console.log(card);
            card.parentElement.removeChild(card);
        }).bind(window, currentCard), 500);
        
        
        currentCard.classList.add("goLeft");
        let id = currentCard.id; //id of the current target
        let namesArray = app.names; //initial array saved in var
        namesArray.forEach(nameArray => {
            if (id == nameArray.id) {
                namesArray.splice(nameArray, 1); // removing one member of array
                app.showNext();
                app.limit();
            }
            
            //let div = document.createElement('div');
            let div = document.querySelector(".overlay");
            //div.appendChild(mes);
            let mes = div.querySelector(".message h1");
            mes.textContent = "Deleted";
            div.classList.remove("hidden");

            setTimeout(() => {
                div.classList.add("hidden")
            }, 500);
            
        });

    },
    
    
    
    
    
    
    
    
    // Fetching data again when less than 3 cards left in the storage

    limit: function () {

        if (app.names.length < 3) {
            app.getData(false);
        }
    },



    //STORING SWIPED RIGHT CARDS  IN session storage 

    storeData: function (ev) {
        let oneCard = ev.currentTarget;
        oneCard.classList.remove("active"); 
        oneCard.classList.add("right"); // giving class name to the current targeted card 
        setTimeout( (function(card){
            console.log(card);
            card.parentElement.removeChild(card);
        }).bind(window, oneCard), 500);

        let id = oneCard.id; // giving id for current  card


        let found = app.names.find(function (element) {
            return element.id == id;
        })
        if (sessionStorage.getItem(KEY))
            app.list = JSON.parse(sessionStorage.getItem(KEY)); // to read from session storage use parse

        app.list.push(found);
        app.names.splice(found, 1);

        let str = JSON.stringify(app.list); // to save to session storage use stringify

        sessionStorage.setItem(KEY, str); // storing data in session storage
       
        app.limit();
         app.showNext();
        
        let div = document.querySelector(".overlay");
            //div.appendChild(mes);
            let mes = div.querySelector(".message h1");
        
            // RED
        
            mes.textContent = "Saved";
            div.classList.remove("hidden");
        mes.setAttribute("id", 'message');
            
            setTimeout(() => {
                div.classList.add("hidden");
                mes.removeAttribute("id", 'message');
            },500);


    },

    // FUNCTION  to show the next following card 

    showNext: function () {
        if (document.querySelector("div .top"))
           // document.querySelector("div .top").classList.remove('top');
        setTimeout(() => { 
            document.querySelector("div .top").classList.add('active');            
            document.querySelector("div .top").classList.remove('top');
                    }, 500)
    },





    favPage: function () {

        document.getElementById("activePages").classList.remove("active");
        document.querySelector("#pages").classList.add("active");
        let pages = document.querySelector("#pages .content");
        
        if (sessionStorage.getItem(KEY))
            app.list = JSON.parse(sessionStorage.getItem(KEY)); // list is an array from session storage 
        let ul = document.createElement('ul');
        ul.classList.add("list-view");
        pages.innerHTML="";
        
        if(app.list.length<1)
            {
                document.querySelector(".message").classList.remove("hidden");
            }
        else{
            document.querySelector(".message").classList.add("hidden");
        }
        
        
        app.list.forEach(item => {

            //create some HTML for each property
            /*
            <ul class="list-view">
            <li class="list-item">
            <img src="//www.example.com/img/pic.jpg" alt="happy" class="avatar"/>
            <span class="action-right icon edit"></span>
            <p>Some text to show.</p>
            </li>
            </ul>
            
            */

            let div = document.createElement('div');
            div.classList.add('favContainer');

            let div2 = document.createElement('div');
            div2.className = "icon delete top_right";

            div2.addEventListener("click", app.deleteCard);

            let li = document.createElement('li');
            li.classList.add("list-item");


            div2.setAttribute("id", item.id);
            let img = document.createElement("img");
            img.setAttribute("src", app.imgBaseURL + "/" + item.avatar);

            let h = document.createElement("h1");
            h.textContent = item.first + " " + item.last; // displaying first and last names in p
            div.appendChild(div2); // inserting img inside the li


            div.appendChild(h); // inserting h inside the li 
            div.appendChild(img);


            li.appendChild(div);

            ul.appendChild(li); // inserting whole li inside the div



        });
        pages.appendChild(ul); // inserting div on the page
         
        let msg = document.querySelector(".pages p");
//        
//        

    },

    homePage: function () {
        document.getElementById("pages").classList.remove("active");
        document.getElementById("activePages").classList.add("active");
    },

    deleteCard: function (ev) {
        let currentCard = ev.currentTarget;
        console.log(currentCard);



        let f = app.list.find(function (element) {
            return element.id == currentCard.id;

        })
        console.log(app.list);
       
        app.list = JSON.parse(sessionStorage.getItem(KEY)); 

        
        app.list.splice(f, 1);

        let str = JSON.stringify(app.list); 
        sessionStorage.setItem(KEY, str); 
        app.favPage();
        
       
        //console.log(app.list);


    }

}




document.addEventListener('DOMContentLoaded', app.init);
