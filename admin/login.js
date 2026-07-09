const SUPABASE_URL = "https://bsrtlctpzojkxecfhwih.supabase.co";

const SUPABASE_KEY = "sb_publishable_XKwCq1BJkFhyNXNdJrBo9g_xVK7VnGF";


const sb = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



async function login(){


const email =
document.getElementById("email").value;


const password =
document.getElementById("password").value;



const {data,error} =
await sb.auth.signInWithPassword({

    email: email,

    password: password

});



if(error){

document.getElementById("error").innerText =
"Email atau password salah";

return;

}



window.location.href="dashboard.html";


}