const SUPABASE_URL = "https://bsrtlctpzojkxecfhwih.supabase.co";

const SUPABASE_KEY = "sb_publishable_XKwCq1BJkFhyNXNdJrBo9g_xVK7VnGF";

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.addEventListener("scroll", () => {

const navbar = document.querySelector(".navbar");

if(window.scrollY > 50){

navbar.style.background = "rgba(15,15,30,.8)";
navbar.style.backdropFilter = "blur(20px)";

}else{

navbar.style.background = "rgba(255,255,255,.08)";

}

});

function beliCustom(){

    const robux = document.getElementById("customRobux").value;

    if(!robux){
        alert("Masukkan jumlah Robux!");
        return;
    }

    pilihProduk(`${robux} Robux - Custom`);

}

function pilihProduk(nominal){

    document.getElementById("nominal").value = nominal;

    document.getElementById("popupOrder").style.display = "flex";

}

function closePopup(){

    document.getElementById("popupOrder").style.display = "none";

}

let adminDipilih = "";

function pilihAdmin(id, element){

    adminDipilih = id;

    document.getElementById("adminTerpilih").value =
        id == 1 ? "Admin May" : "Admin Qyuya";

    document.querySelectorAll(".admin-option").forEach(card=>{
        card.classList.remove("active");
    });

    element.classList.add("active");
}

async function kirimWhatsapp(){

let username = document.getElementById("username").value;
let nominal = document.getElementById("nominal").value;
let payment = document.getElementById("payment").value;


if(username=="" || nominal=="" || payment==""){

alert("Lengkapi semua data terlebih dahulu!");

return;

}

    let nomor="";

    if(adminDipilih==1){

        nomor="6281278363732";

    }else{

        nomor="6282265057169";

    }

    let pesan =
`Halo Admin QyuyaStore 👋

Saya ingin Top Up Robux

Username : ${username}
Nominal : ${nominal}
Pembayaran : ${payment}`;

let admin = document.getElementById("adminTerpilih").value;

const { error } = await sb
.from("orders")
.insert([
{
    username: username,
    produk: nominal,
    pembayaran: payment,
    admin: admin,
    status: "Pending",
    created_at: new Date().toISOString()
}
]);

if(error){

    console.log("DETAIL ERROR:", error);

    alert(error.message);

    return;

}

console.log("Order berhasil disimpan ke Supabase");

    window.open(
    `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`,
    "_blank"
    );

}

function togglePayment(){

    const menu = document.getElementById("paymentDropdown");

    menu.style.display =
    menu.style.display === "block"
    ? "none"
    : "block";

}


function pilihPembayaran(nama){

    document.getElementById("payment").value = nama;

    document.getElementById("paymentText").innerText = nama;

    document.getElementById("paymentDropdown").style.display = "none";

}


const customInput = document.getElementById("customRobux");
const customHarga = document.getElementById("customHarga");

if (customInput && customHarga) {

    customInput.addEventListener("input", () => {

        const robux = parseInt(customInput.value) || 0;

        let hargaPerRobux = 150;

        if (robux >= 5000) {
            hargaPerRobux = 130;
        } else if (robux >= 1000) {
            hargaPerRobux = 140;
        }

        const total = robux * hargaPerRobux;

        customHarga.innerText =
            "Rp" + total.toLocaleString("id-ID");

    });

}

async function loadStock(){

    const { data, error } = await sb
        .from("settings")
        .select("*");

    console.log(data);
    console.log(error);

    if(error){
        document.getElementById("robuxStock").innerText = "ERROR";
        return;
    }

    if(!data || data.length === 0){
        document.getElementById("robuxStock").innerText = "DATA KOSONG";
        return;
    }

    document.getElementById("robuxStock").innerText =
        Number(data[0].robux_stock).toLocaleString("id-ID");

}

loadStock();

loadStock();
loadStock();

sb.channel("stock")

.on(
    "postgres_changes",
    {
        event:"UPDATE",
        schema:"public",
        table:"settings"
    },

    loadStock

)

.subscribe();