const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const lastname_input = document.getElementById('lastname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password-input')
const error_message = document.getElementById('error-message')

form.addEventListener('submit', (e) => {
    //estetään lomakkeen submittaus, jos siinä on virhe
    //Alla on lista, joka ilmoittaa virheistä ja virhe ilmoituksista
    let errors = []

    //rekisteröitymis sivun ja sisäänkirjautumis sivulla eri virheet
    //Erotetaan sivut etunimen inputin avulla, koska sisäänkirjautumisessa
    //ei tarvita etunimeä
    if(firstname_input){

        //Rekisteröitymis sivun virheet aktivoituvat, jos virhe sivulla on 
        //Etunimi input kenttä
        errors = getSignupFormErrors(firstname_input.value, lastname_input, email_input.value, password_input, repeat_password_input)

    } else {

        //Muussa tapauksessa se on kirjautumis sivun virheet
        errors = getLoginFormErrors(email_input.value, password_input)
    }

    if(errors.length > 0){
        //estetään lomakkeen lähetys, jos Errors listalla on yhtäkään virhettä
        //niin kauan kuin se on suurempi kuin nolla, niin lomaketta ei voi lähettää
        e.preventDefault()
        //tuodaan virheilmoitukset näkyviin Join metodin avulla P kenttään HTML puolelle
        //Join pystyy tuomaan useamman listan itemin näkyviin, siksi piste. Jos on useampi kenttä tyhjä
        //ne erotetaan pisteellä
        error_message.innerText = errors.join (". ")
    }
})


function getSignupFormErrors(firstname, lastname, email, password, repeatPassword) {

    let errors = []

    if(firstname === '' || firstname === null) {
        errors.push('Tarvitaan Etunimi')
        //virhe ilmoitus pitää tuoda näkyviin käyttäjälle
        firstname_input.parentElement.classList.add('incorrect')
    }

    
    if(lastname === '' || lastname === null) {
        errors.push('Tarvitaan Sukunimi')
        //virhe ilmoitus pitää tuoda näkyviin käyttäjälle
        lastname_input.parentElement.classList.add('incorrect')
    }
    
    if(email === '' || email === null) {
        errors.push('Tarvitaan Sähköposti osoite')
        //virhe ilmoitus pitää tuoda näkyviin käyttäjälle
        email_input.parentElement.classList.add('incorrect')
    }

    
    if(password === '' || password === null) {
        errors.push('Tarvitaan Salasana')
        //virhe ilmoitus pitää tuoda näkyviin käyttäjälle
        password_input.parentElement.classList.add('incorrect')
    }

    if( password !== repeatPassword){
        errors.push('Salasanat eivät ole samat')
        password_input.parentElement.classList.add('incorrect')
        repeat_password_input.parentElement.classList.add('incorrect')
    }

    return errors;
}

const allInputs = [firstname_input, lastname_input, email_input, password_input, repeat_password_input]

//tällä poistetaan Eventlisterin kautta INCORRECT luokka, kun käyttäjä kirjoittaa input kenttään
allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect')
            //tyhjennetäöän virheilmoitukset myös
            error_message.innerHTML= ''
        }
    })
})
