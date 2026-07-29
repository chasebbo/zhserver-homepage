// ================= GÄSTEBUCH =================

const guestbookForm = document.querySelector("#guestbook-form");

if (guestbookForm) {

    guestbookForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const formData = new FormData(guestbookForm);

        const response = await fetch(
            "https://formspree.io/f/xqerjqjz",
            {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            }
        );


        if (response.ok) {

            alert(
                "Vielen Dank für deinen Eintrag! Er wird nach Prüfung freigeschaltet."
            );

            guestbookForm.reset();

        } else {

            alert(
                "Es gab einen Fehler beim Senden. Bitte versuche es später erneut."
            );

        }

    });

}