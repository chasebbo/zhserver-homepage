const SUPABASE_URL = "https://yawadxzeyyrozmlrokun.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlhd2FkeHpleXlyb3ptbHJva3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzQ4MTIsImV4cCI6MjEwMDkxMDgxMn0.B53O3gHURnfxUkVGKaZJ5ssx27Bj9FNMU70Yn85tfxE";

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

(async () => {

    if (!await window.ZHAdminAccess.require(sb)) return;

    loadEntries();

})();

async function loadEntries(){
    if (!await window.ZHAdminAccess.require(sb)) return;

    const {data,error}=await sb
        .from("guestbook")
        .select("*")
        .eq("approved",false)
        .order("created_at",{ascending:false});

    if(error){

        console.error(error);
        return;

    }

    const container=document.getElementById("entries");

    container.innerHTML="";

    if(data.length===0){

        container.innerHTML=`
            <div class="card admin-card">
                <h3>Keine offenen Einträge.</h3>
            </div>
        `;

        return;

    }

    data.forEach(entry=>{

        const date=new Date(entry.created_at).toLocaleString("de-DE");

        container.innerHTML+=`

        <div class="card admin-card">

            <h3>${window.ZHAdminAccess.escapeHTML(entry.name)}</h3>

            <small>${date}</small>

            <p>${window.ZHAdminAccess.escapeHTML(entry.message)}</p>

            <div class="admin-actions">

                <button class="btn"
                    onclick="approve(${entry.id})">

                    ✅ Freigeben

                </button>

                <button class="btn"
                    onclick="removeEntry(${entry.id})">

                    ❌ Löschen

                </button>

            </div>

        </div>

        `;

    });

}

async function approve(id){
    if (!await window.ZHAdminAccess.require(sb)) return;

    const { data, error } = await sb
        .from("guestbook")
        .update({ approved: true })
        .eq("id", id)
        .select();

    if(error){
        alert(error.message);
        return;
    }

    loadEntries();

}


async function removeEntry(id){
    if (!await window.ZHAdminAccess.require(sb)) return;

    if(!confirm("Eintrag wirklich löschen?"))
        return;

    await sb
        .from("guestbook")
        .delete()
        .eq("id",id);

    loadEntries();

}
