//NOTES JAVASCRIPT OSUUS

//Muistiinpano Array, johon tallennetaan muistiinpano Localia käyttäen
let notes = [];
let editingNoteId = null


//Funktio joka tuo muistiinpanot listalta ja parsettaa ne luettavaan muotoon
//Sivulle
function loadNotes() {
    const savedNotes = localStorage.getItem('quickNotes')
    return savedNotes ? JSON.parse(savedNotes) : []
}

function saveNote(event) {

    //Estää, kun submit buttonia painetaan, että sivu ei lataudu uudestaan
    event.preventDefault()

    //Napattiin otsikko ja muistiinpano tekstit, tarvitaan .value jotta
    //saadaan input kentän tekstit itsellemme. Trim taas poistaa turhat 
    //välilyönnit
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    //lisäämme if rakenteen, koska muuten editoidessa saamme uuden muistiinpanon
    //tallennus nappulan UNSHIFT metodin takia, tällä if rakenteella saamme 
    //muokattua olemassa olevaa muistiinpanoa
    if(editingNoteId) { 

        //etsimme tällä vastaavan note ID:n, jotta muokkaus onnistuu
        const noteIndex = notes.findIndex(note => note.id === editingNoteId)
        //käytämme SPREAD OPERATORIA, kompleksi, mutta helpottaa myöhemmin, jos halutaan
        //lisätä kansioita, tägejä, päivämääriä, SPREAD OPERATOR kopioi kaikki arvot ja 
        //lisää ne sinne
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content
        }

    } else {

    //Käytetään aiemmin luotua Arrayta ja lisätään muistiinpanot sinne objekteina
    //unshiftillä saamme lyötyä objektit listaan aina kun uusia lisätään
    //käytetään aiemmin napattuja arvoja TITLE ja CONTENT, generateID luodaan myöhemmin
    notes.unshift({
        id: generateId(),
        title: title,
        content: content
    })
    }


    //Kutsutaan funktiota SaveNotes, joka tallentaa ne JSON tiedostona LOCALSTORAGEEN, sekä 
    //funktiota joka sulkee muokkaus/lisäämis ikkunan sekä funktio joka renderöi muutokset näkyviin sivulle
    closeNoteDialog()
    saveNotes()
    renderNotes()

}

//Luo ID:n päivämäärän mukaan, to string muuttaa sen merkkijonoksi, jotta helpompi
//Tallentaa takaisin objektiin
function generateId() {
    return Date.now().toString()
};


//tallentaan meidän lista merkkijonona, stringify tarvitaan, koska ollaan
//annettu ne objekteina ja LocalStorageen voi tallentaa ne vain merkkijonona
function saveNotes() {
    localStorage.setItem('quickNotes', JSON.stringify(notes))
}

//Poisto nappi toimintaan filteriä käyttäen.
//Koska meillä on jo kyseisin muistiinpanon ID, kun nappia painetaan
//Filteri metodi tietää, mikä muistiinpano jää uuden listan kopiosta pois
//Näin saamme poistettua muistiinpanoja
function deleteNote(noteId) {
    notes = notes.filter(note => note.id != noteId)
    saveNotes()
    renderNotes()
}


function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');

    //jos ei ole muistiinpanoja, tällä ja pienillä HTML tägeillä sivu ei ole ihan tyhjä
    //vaan kutsuu käyttäjän lisäämään muistiinpanoja
    if(notes.length === 0) {
        notesContainer.innerHTML = `
        <div class="empty-state">
            <h2> No notes yet </h2>
            <p>Create your first note to get started!</p>
            <button class="add-note-btn" onclick="openNoteDialog()">+ Add your first note </button>
            </div>
        `
        return
    }


    //Tällä tuomme muistiinpanot esiin, jos niitä on
    //HTML tägeihin tuomme muistiinpanojen otsikot ja teksti sisällön
    //Ne pitää mapata, että ne saadaan näkyviin arraysta, koska niitä on monta
    // ja että ne tulevat kaikki nätisti näkyviin, Mapilla saamme aina yhden objektin näkyviin jokaiseen
    //lohkoon. 
    notesContainer.innerHTML = notes.map(note => `
        <div class="notes-card">
            <h3 class="note-title">${note.title}</h3>
            <p class="note-content">${note.content}</p>
            <div class="note-actions">
            <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="m381-240 424-424-57-56-368 367-169-170-57 57 227 226Zm0 113L42-466l169-170 170 170 366-367 172 168-538 538Z"/>
                </svg>
            </button>
            <button class="delete-btn" onclick="deleteNote('${note.id}')" title="delete Note">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/>
                </svg>
            </button>
            </div>
        </div>
        ` ).join('')
    //JOIN metodi tuo meille merkkijonon näkyviin listan sijaan, jotta siintä tulee yksittäinen merkkijono
}

//Funktio joka avaa muistiinpanot
//noteide = null voimme antaa default arvon idhen
//Jos emme anna arvoa Elsessä, se on null, mutta if:ssä annoimme
//joten se pitää paikkansa, edit notessa HTML:ssä haemme asiaa jo NoteId:llä
function openNoteDialog(noteId = null) {
    //Elementit kaapattu ID:n kautta Notes.html:stä
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    if(noteId) {
       //muokkaustila
       //Tällä koodin pätkällä löydämme oikean muistiinpanon, joka muokkaamme
       //local storagesta notes.find methodilla etsimme local storagesta
       //ID:n kautta juuri sen mihin olemme klikanneet EDIT kohdassa
        const noteToEdit = notes.find(note => note.id === noteId)
        //Vaihdamme Globaali muuttujan tämän avulla
        editingNoteId = noteId

        //Tällä pääsemme viimein muokkaamaan muistiinpanoa, haemme EDIT NOTE
        //elementin ID:n avulla
        document.getElementById('dialogTitle').textContent = 'Edit Note'
        //Tällä muokkaamme otsikkoa
        titleInput.value = noteToEdit.title
        //Tällä muokkaamme tekstikenttää
        contentInput.value = noteToEdit.content

    } else {
        //lisää uusi muistiinpano
        //Editing note id on null, koska nyt lisäämme muistiinpanon,
        //emme muokkaa sit
        editingNoteId = null
        //Otsikko muutetaan takaisin lisää uusi muistiinpano
        document.getElementById('dialogTitle').textContent = "Add New Note"
        //tekstikentät ovat tyhjiä näillä arvoilla
        titleInput.value = ''
        contentInput.value = ''
    }

    //avaa dialogi/muistiinpano ikkunan
    dialog.showModal();
    titleInput.focus();

};

//Muistiinpano sulku ikkuna
function closeNoteDialog() {
    //Kaapattu Notedialog ID jotta se voidaan sulkea
    document.getElementById('noteDialog').close()

};


//Tärkein Eventlistener, se odottaa, että kaikki pää elementit on ladattu
//Ja sillä saadaan suljettua Muistiinpano ikkuna, kun klikataan ikkunan
//ulkopuolelle, sekä submit tapahtuma
document.addEventListener('DOMContentLoaded', function() {
    
    notes = loadNotes()
    console.log("Notes before rendering:", notes)

    //tällä tuomme muistiinpanot näkyviin, kun DOMcontent on ladannut
    renderNotes()

    //Tallentaa Muistiinpanot, odottaa Submit napin toimintaa
    document.getElementById('noteForm').addEventListener('submit', saveNote);

    //Suljetaan notedialog käyttäen kuuntelijaa, jos klikataan muualle kuin Event.targetiin,
    //funktio käyttää closeNoteDialog funktiota ja sulkee Muistiinpano ikkunan
    document.getElementById('noteDialog').addEventListener('click', function(event) {
        if(event.target === this) {
            closeNoteDialog()
        }
    });
});