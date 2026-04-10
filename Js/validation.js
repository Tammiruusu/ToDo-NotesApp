const form = document.getElementById('form')
const firstname_input = document.getElementById('firstname-input')
const lastname_input = document.getElementById('lastname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password-input')

form.addEventListener('submit', (e) => {
    //estetään lomakkeen submittaus, jos siinä on virhe
    //e.preventDefault() 
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

})
