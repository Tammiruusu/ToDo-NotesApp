// kaapataan Queryselectorilla elementit HTML puolelta, jotta päässään niihin kiinni JS:llä
// käytetään CONSTIA, koska nämä eivät vaihdu, joten LETiä ei tarvitse

const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

//Luodaan TYHJÄ Array/lista jonne tallennetaan kaikki todo:t 
let allTodos = getTodos();
updateTodoList();

//Lisätään kuuntelija, joka aktivoituu submittia(ADD-BUTTON) painamalla
//Ja toteuttaa annetun funktion
todoForm.addEventListener('submit', function(e){
    //PreventDefault estää, että sivu päivittyy heti submittin jälkeen
    e.preventDefault();
    addTodo();
})


//Functio jolla lisätään todo:t arrayhin
function addTodo(){
    //trim metodi poistaa turhat 'tyhjät', esim.'        jees' > 'jees'
    //todoInput.valua nappaa kiinni input kentän tekstiin
    const todoText = todoInput.value.trim();
    //Jos input kentässä on enemmän kirjaimia kuin 0, vasta silloin todo lisätään
    //Ylhäällä trim poistaa välilyönnit, joten se ei lasketa 'pituuteen/length'

    if(todoText.length > 0){

        //Tallennamme todot objektina, jotta kun sivua päivitetään, array muistaa oliko
        //todo/task DONE
        //completed on automaattisesti false
        const todoObject = {
            text: todoText,
            completed: false
        }

        //Käytetään PUSH metodia, jotta voidaan työntää input kentän teksti arrayhin
        //työnnetään objekti teksti kohtaan, mutta nyt pitää muokata update funktiota, 
        // muuten näkyy vain Object, object eli olio olio
        allTodos.push(todoObject);
        //palauttaa päivitetyn listan, oli sinne lisätty tai poistettu asioita
        updateTodoList();
        //Kutsutaan todon tallentaja funktiota, jolloin luodut muutokset menevät suoraan
        //LOcal storageen.
        saveTodos();
        //Kun todo lisätty, alla oleva komento tyhjentää kentän, tapahtuu vain jos käyttäjä
        //lisää tekstiä, koska if lausekkeen sisällä
        todoInput.value = "";
    }
}


//päivittää listan/Arrayn kun siihen lisätään jotain tai poistetaan jotain
function updateTodoList(){
    //tyhjentää listan
    todoListUL.innerHTML = "";
    //Käytetään foreach looppia, jotta tuodaan esiin kaikki arrayn itemit näkyviin
    allTodos.forEach((todo, todoIndex)=>{
        //tarvitsee RETURN statementin Createtodo Itemiin, jotta tämä toimii
        todoItem = createTodoItem(todo, todoIndex);
        //Appendilla tuodaan todot näkyviin sivulle
        todoListUL.append(todoItem);
    })
}

function createTodoItem(todo, todoIndex){
    //luodaan uusi ID perustuen Arrayn indeksiin jokaiselle todo:lle
    //saadaan forEach loopista todoIndex, joka lisää sen jokaiseen IDhen nyt
    const todoId = "todo-"+todoIndex;
    //Luodaan uusi lista elementti, jotta voidaan lisätä todo input kentän tekstit näkyville
    //Create elementin kautta, "li" luo lista itemin
    const todoLI = document.createElement("li");
    //Koska nyt tallennamme OLION/Object, pitää tehdä muokkaus koodiin, jotta
    //tieto saadaan taas sivulle näkyviin
    const todoText = todo.text;
    //Annetaan listalle luokka TODO, niin se saa CSS:stä muokkaukset jotka teimme
    todoLI.className = "todo"; 
    //``tärkeät, jotta voidaan käyttää useata templatea samaan aikaan
    //Annettu TodoID, jotta jokaiselle todo taskilla oma ID
    //Todo text tille lisätty Todo, jolloin task tulee näkyviin sivulle
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" height="30px" width="30px" viewBox="-20 0 190 190" xmlns="http://www.w3.org/2000/svg">
            <path d="M120.69 101.68C114.53 101.68 110.33 97.91 110.16 92.51C110.03 88.1 112.58 84.29 116.64 84.29C121.81 84.29 123.93 89.44 120.86 92.48L116.37 89.26C114.99 90.77 115.48 96.19 120.14 96.19C124.21 96.19 126.14 93.36 126.14 88.92C126.14 84 123.06 80.06 114.73 80.06C107.31 80.06 103.5 86.06 103.5 94.71C103.5 99.24 106.09 102.87 109.02 106.51C114.36 105.51 119.48 112.89 116.27 117.41C116.932 119.172 117.271 121.038 117.27 122.92C117.267 123.857 117.17 124.792 116.98 125.71C121.82 130.96 113.98 140.37 107.98 136.29C105.07 137.594 101.919 138.275 98.73 138.29C95.56 143.71 85.15 140.96 85.73 134.44C83.709 133.184 81.5645 132.138 79.33 131.32C79.43 137.13 71.18 140.81 66.73 137.54C64.8991 140.142 62.5541 142.34 59.84 144C59.84 144.19 59.84 144.38 59.84 144.58C60.02 154.52 43.12 154.76 42.94 145.06C42.94 144.92 42.94 144.8 42.94 144.67C40.0878 143.796 37.3889 142.483 34.94 140.78C27.28 145.35 18.48 133.22 24.79 127.39C23.5874 123.872 22.9823 120.178 23 116.46C14.28 113.63 18.09 98.69 26.8 100.06C28.4235 97.1054 30.6398 94.5181 33.31 92.46C31.77 83.58 46.16 80 49.41 87.69C51.7941 87.7882 54.1517 88.2294 56.41 89L56.61 88.81C63.07 83.23 72.5 94.16 66.36 99.67C67.67 105.19 65.73 110.94 61.99 112.96C56.99 105.56 46.49 107.96 46.49 117.06C46.49 123.42 50.99 125.85 55.84 125.85C61.84 125.85 65.47 114.53 73.73 114.53C85.95 114.53 93.05 126.21 98.44 126.21C102.7 126.21 103.82 124.3 103.82 121.48C103.82 112.99 94.6 108.32 94.6 94.93C94.6 82.63 102.6 72.6 114.6 72.6C125.74 72.6 131.96 79.43 131.96 87.85C131.96 96.27 127.74 101.68 120.69 101.68ZM63.6 96.91C66.08 94.77 61.6 89.57 59.07 91.76C56.54 93.95 60.88 99.26 63.6 96.91ZM43.68 135.45C47.38 133.26 43.11 125.64 39.18 127.97C35.58 130.1 40 137.62 43.68 135.45ZM26.57 104.58C22.9 103.64 20.9 111.32 24.66 112.28C28.42 113.24 30.6 105.62 26.57 104.58ZM28.37 130.32C25.29 132.54 29.91 138.99 33.06 136.72C36.21 134.45 31.74 127.89 28.37 130.32ZM35.49 111.21C31.41 109.63 28.07 118.21 32.26 119.78C36.45 121.35 40 112.94 35.49 111.21ZM45.49 90.09C44.63 86.39 36.89 88.16 37.77 91.95C38.65 95.74 46.43 94.14 45.49 90.09ZM46.49 99.73C45.09 95.79 36.86 98.73 38.28 102.73C39.7 106.73 48 104 46.47 99.73H46.49ZM47.49 144.81C47.56 148.61 55.49 148.49 55.42 144.6C55.35 140.71 47.4 140.66 47.47 144.81H47.49ZM52.84 135.61C53.33 139.76 62.01 138.76 61.5 134.51C60.99 130.26 52.29 131.07 52.82 135.61H52.84ZM68.38 133.11C69.68 136.31 76.38 133.61 75.03 130.33C73.68 127.05 66.93 129.61 68.36 133.11H68.38ZM72.93 122.57C72.41 126.33 80.26 127.46 80.8 123.57C81.34 119.68 73.49 118.45 72.91 122.57H72.93ZM89.48 134.21C88.77 137.21 95.15 138.76 95.88 135.63C96.61 132.5 90.23 130.86 89.46 134.21H89.48ZM109.82 133C112.26 135 116.41 129.9 113.92 127.87C111.43 125.84 107.16 130.86 109.82 133ZM112.6 115.82C115.12 113.94 111.22 108.67 108.6 110.59C105.98 112.51 109.85 117.9 112.6 115.85V115.82Z"/>
            </svg>

        </label>
        <label for="${todoId}" class="todo-text">
            ${todoText}
        </label>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" height="30px" width="30px"viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path d="M108.28 18.78c-1.2 6.05 1.1 13.32 9.095 19.876 15.883 13.01 36.716-3.12 27.875-19.875h-36.97zm174.564 0c13.572 15.575 25.36 48.026 21.687 77.22-3.915 31.118-22.083 59.048-73.624 67.094v.094c-1.964.284-3.904.743-5.812 1.343 4.17.89 8.657 2.86 13.344 6.22 24.482 17.577 3.918 55.804-26.125 36.47-8.196-5.266-12.213-12.31-13.032-19.19-4.615 11.776-2.376 25.68 12.47 37.126 42.122 32.48 76.872-19.863 48.844-50.437 35.076-12.994 54.042-38.53 60.594-65.97 17.85 2.145 40.616 8.678 58.156 22.22 19.867 15.337 34.025 38.73 29.844 79.25l-.032.405v.406c-.43 27.1 3.257 52.267 13.906 77.314-.175-.088-.355-.164-.53-.25 10.834 28.695-4.215 77.915-32.094 76.375-1.608-.09-3.144-.24-4.625-.47 10.87-3.895 19.736-14.11 20.187-31.47.57-21.935-30.486-31.816-48.688-21.28 1.853-10.077 5.738-19.852 11.125-27.53 2.282-2.24 4.347-4.612 6.188-7.095.204.627.43 1.27.72 1.906 9.98 22.058 34.89 7.416 25.186-11.405-4.35-8.457-11.074-10.648-16.686-9.03 3.504-11.767 3.415-24.225.406-35.72-3.952-15.098-13.013-28.82-26.625-37.03-7.976-4.812-17.48-7.51-27.844-7.44-.69.006-1.394.034-2.092.064-5.57.233-11.385 1.277-17.313 3.186-5.246.927-10.17 3.588-14.03 8.438-23.005 28.896 14.76 74.018 41.967 39.687 8.61-10.862 8.926-21.705 4.813-30.374 1.69.692 3.303 1.508 4.844 2.438 8.787 5.3 15.35 14.822 18.217 25.78 2.87 10.96 1.946 23.044-3.312 33.126-4.384 8.406-11.626 15.654-23.28 20.28-1.272.41-2.53.853-3.783 1.314 18.878 44.79-9.97 58.624-46.03 37.156-6.794 10.808-11.198 22.857-13.25 35.47 9.883-4.887 23.666-6.502 41.687-2.595 28.884 6.263 33.747 41 18.75 61.906.643-2.984 1.033-6.202 1.124-9.686.48-18.44-18.605-29.432-37-29.156-17.28.258-33.966 10.457-33.28 33.75.14 4.844 1.124 9.19 2.748 13.03-4.827-1.217-9.4-2.263-13.593-3.312-20.567-5.145-33.424-9.23-50.25-42.22-11.65-22.837-13.746-44.61-9.657-62.717.35-1.55.75-3.07 1.187-4.564.887-2.386 2.22-4.867 4.063-7.437 14.096-19.637 44.76-3.16 29.25 20.936-1.586 2.468-3.375 4.467-5.282 6.03 10.913-.16 22-6.1 29.69-20.56 13.784-25.93-8.35-51.58-31.5-51.688-1.84-.01-3.696.173-5.532.5-3.696-10.15-11.607-14.724-19.125-14.657-11.395.103-21.84 10.833-15.063 28.814 1.5 3.97 3.765 6.996 6.438 9.187-15.838 24.13-20.18 58.28-6.22 93.376-28.655 4.51-48 1-62.25-6.375-16.074-8.32-26.524-22.114-35.718-38.124-9.194-16.01-16.705-33.956-27.813-48.97-9.438-12.754-22.502-23.363-40.28-26.686v19c10.905 2.694 18.18 9.218 25.28 18.813 9.153 12.37 16.656 29.85 26.594 47.156 9.94 17.305 22.74 34.724 43.376 45.405 19.365 10.023 44.896 13.558 79.28 7.28 17.85 31.407 38.335 40.456 59 45.626 20.14 5.04 40.485 7.83 68.376 28.97 1.97 1.66 3.995 3.258 6.032 4.78.594.49 1.18.965 1.78 1.47l.095-.094c44.505 32.063 102.997 31.564 138.467-3.906 38.87-38.87 35.765-105.384-6.187-150.844-26.624-35.576-33.77-66.875-33.156-105.562h-.03c4.428-45.38-13.045-76.668-37.033-95.188-21.172-16.346-46.585-23.457-67-25.875 1.496-26.37-5.78-52.345-17.717-71.5h-23.22zM88.438 52.688c-3.178 0-6.483.374-9.907 1.188-5.71 1.356-10.715 4.073-15 7.75-.027.024-.064.038-.093.063-2.25 1.463-4.222 3.494-5.75 6.093-.033.058-.092.1-.124.157-2.415 4.2-3.617 9.88-2.907 17.063 2.628 26.407 40.834 27.546 39.313-3.875-.388-8.14-3.673-14.105-8.19-17.813 15.426 4.92 26.523 22.082 16.72 48.063-10.34 27.408-41.76 29.372-55.47 12.313 5.018 20.444 20.162 35.828 46.44 29.656 14.73-3.46 24.825-11.138 31-20.78.233 17.556-5.215 34.5-14.782 47.967-18.347 25.828-50.26 39.48-90.782 19.126v20.375c40.907 16.38 78.436 3.814 100.875-22.155 19.068 10 28.71 30.633 27.782 48.344-.462 8.83-3.42 16.56-8.75 22.25 1.273-11.394-3.145-22.947-14.906-28.064-35.92-15.636-71.766 35.453-29.125 53.906 2.805 1.213 5.5 2.042 8.095 2.563v.03c.085.01.165.024.25.033 3.398.657 6.63.743 9.625.375 14.957-.285 27.384-4.945 36.375-12.844 10.904-9.582 16.36-23.27 17.094-37.283 1.275-24.38-11.26-50.987-35.69-64.78 6.762-12.177 10.956-25.986 12.157-40.313 5.06 2.946 10.495 4.818 15.97 5.656 12.77 1.955 25.603-1.35 36.312-7.844 10.708-6.493 19.516-16.308 23.75-28.437 3.2-9.173 3.47-19.695-.032-30.064-3.167-14.78-14.114-27.622-29.438-27.625-2.21 0-4.495.248-6.875.814-30.3 7.19-32.07 68.89 1.625 70.062-7.1 3.967-15.24 5.71-22.53 4.594-7.578-1.16-14.436-4.948-20.095-13.906-2.58-13.888-8.185-27.66-17.25-40.344-7.554-12.997-20.047-22.31-35.688-22.313zm157.156 57.75c-4.71.03-9.694 2.802-13.156 9.532-9.705 18.82 15.205 33.46 25.187 11.405 5.02-11.105-3.04-20.995-12.03-20.938zm48.437 145.5c-19.927.602-18.62 25.754-.717 27.532 24.093 2.383 23.874-26.494 2.718-27.5-.686-.035-1.356-.052-2-.032z"/>
            </svg>
        </button>
    `

    //Tällä linkitetään luomamme Delete iconi, jolloin se poistaa todon
    //Queryselectorilla nappaamme kiinni yllä antamaamme HTML koodiin ja Delete iconiin
    const deleteButton = todoLI.querySelector(".delete-button");
    //Annamme Deletebuttonille Event listenerin, nuoli funktiolla annamme 
    //mitä tapahtuu kun KLICK tulee, eli poistamaan todon
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    })

    //kaappaamme checkboxin queryselectorilla, jolloin saamme käsiimme tiedon
    //kun checkboxia on käytetty ja tallennetaan se tila arrayhin
    //jotta localstorage muistaa ensikerralla, oli todo tehty vai ei
    const checkbox = todoLI.querySelector("input");
    //lisäämme tapahtumakuuntelijan, joka tarkkailee checkboxin muutosta
    //jos se muutttuu, nuolifunktio tallentaa tilan listalle
    //TodoIndex varmistaa, että kyseessä on oikea checkbox listalta
    checkbox.addEventListener("change", ()=>{
        allTodos[todoIndex].completed = checkbox.checked;
        saveTodos();
    })
    //Tällä koodin pätkällä haetaan tieto Local storagesta, 
    //jos se on totta, pysyy Checkbox ruksittuna kun sivua
    //päivittää
    checkbox.checked = todo.completed;

    //Palauttaa lisätyn asian Arrayhin, jolloin muutos tulee näkyviin
    return todoLI;
}

//Luodaan delete funktio, joka on linkitetty CreateTodoItemin kanssa, koska
//käytämme DELETE nappia, mikä on html koodissa annettu
function deleteTodoItem(todoIndex){
    //Filteröimme oikean Todo kohdan FILTER metodin avulla
    //Metodi palauttaa joko totta tai väärin, haluamme että
    //metodi palauttaa FALSE, jotta se poistaa kyseisen 
    //kohdan listaltamme
    //Tämä luo uuden arrayn, kopion entisestä, jossa EI OLE
    //kyseistä merkintää, minkä kohdalla olemme DELETEÄ käyttänyt
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    //uusi lista pitää tallentaa, muuten siintä ei ole mitään hyötyä
    saveTodos();
    //listä pitää myös päivittää
    updateTodoList();
}




//Tallenetaan tällä funktiolla Todo array LOcal Storageen
//Tai kun tulee muutoksia
function saveTodos(){
    //VAIN Merkkijonoja voi tallentaa LocalStorageen, joten meidän pitää
    //Muuttaa Array merkkijonoksi, muuttamalla tieto Json muotoon
    const todosJson = JSON.stringify(allTodos);
    //Local storage object löytyy suoraan emmeteistä
    //Monta metodia, get, set, remove ja clear
    //Tiedon tallentamiseen käytetään SetItem
    //SetItem haluaa kaksi arvoa, annanmme sille merkkijonon sekä 
    //Arrayn jonka loimme alussa, allTodos, joka on muutettu yllä mainitun 
    //muuttujan kautta nyt merkkijonoksi
    localStorage.setItem("todos", todosJson);
}
//Functiota täytyy kutsua, jotta se aktivoituu
saveTodos();

function getTodos(){
    //Luodaan funktio, jolla kutsutaan todo tiedot esiin 
    //LOcal Storagesta, käytetään metodia getItem
    //KOska ilman tätä tieto ei lataudu local storagesta
    //Luodaan OR rakenne, jotta local storagesta ei palaudu nullia || 
    //Nyt jos "todos" on tyhjä, se tallentaa tyhjän arrayn
    const todos = localStorage.getItem("todos") || "[]";
    //täytyy palauttaa ne oikeaan muotoon, koska nyt ne on tallennettu 
    //Merkkijonoksi Jsonina
    return JSON.parse(todos);
}


//LÄPINÄKYVÄN MENUN JS

// MOBIILISSA NÄKYVÄ MENU
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');

    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });


//teeman vaihto nappi
function toggleTheme(){
    //Togglella nappaamme kiinni Body:ssa olevaan Dark-theme luokkaan
    //Sillä saamme helposti otettua käyttöön siellä annetut arvot
    //tämä kuitenkin vaihtuu takaisin perus teemaan, kun sivua päivitetään
    //ellei sitä arvoa tallenneta jonnekin
    const isDark = document.body.classList.toggle('dark-theme')
    //jotta tumma moodi pysyy sivun päivittyessä, se pitää tallentaa
    //local storageen SetItemin avulla, jolla se on tallennettu ehdolla
    //isDark? 
    localStorage.setItem('theme', isDark ? '🦑' : '🍡')
    //tällä vaihdetaan buttonin tekstiä/ikonia, jos on darkmode päällä, tulee näkyviin
    //Sun, jos taas ei, tulee Moon
    document.getElementById('themeToggleBtn').innerHTML = isDark ? '🍡' : '🦑'
}


//tällä saamme tallennetun teeman käyttöön, kun sivu päivittyy
//parantaa käyttäjän kokemusta, kun ei aina tarvitse vaihtaa teemaa haluttuun
//joka kerta kun vierailee sivulla
function applyStoredTheme(){
    //haetaan local storagesta teeman tiedot, onko dark mode valittu?
    //jos on, tee nämä muutokset
    if(localStorage.getItem('theme') === '🦑')
        document.body.classList.add('theme')
        document.getElementById('themeToggleBtn').innerHTML = '🍡'     
}


//Tärkein Eventlistener, se odottaa, että kaikki pää elementit on ladattu
//Ja sillä saadaan suljettua Muistiinpano ikkuna, kun klikataan ikkunan
//ulkopuolelle, sekä submit tapahtuma
document.addEventListener('DOMContentLoaded', function() {

        //Kaapataan HTML:stä teeman vaihtonappi, annetaan sille funktio ja lisätään funktio
    //ylöpuolelle
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme)

    });