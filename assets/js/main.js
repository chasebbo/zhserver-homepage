// ================= GÄSTEBUCH =================

const guestbookForm = document.querySelector("#guestbook-form");

if (guestbookForm) {

    guestbookForm.addEventListener("submit", function(event) {

        

        const name = document.querySelector("#guestbook-name").value;
        const message = document.querySelector("#guestbook-message").value;


        if (!name || !message) {

            alert("Bitte Name und Nachricht ausfüllen.");
            return;

        }


        alert(
            "Danke für deinen Eintrag! Er wird nach Prüfung freigeschaltet."
        );


        guestbookForm.reset();

    });

}