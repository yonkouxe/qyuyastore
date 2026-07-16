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

    // Reset username
    document.getElementById("username").value = "";

    // Reset admin
    document.getElementById("adminTerpilih").value = "";

    document.querySelectorAll(".admin-option").forEach(card=>{
        card.classList.remove("selected");
    });

    // Reset pembayaran
    document.getElementById("payment").value = "";
    document.getElementById("paymentText").innerText = "Pilih metode pembayaran";

}

function closePopup(){

    document.getElementById("popupOrder").style.display = "none";

}

function pilihAdmin(admin, element){

    document.querySelectorAll(".admin-option").forEach(card=>{
        card.classList.remove("active");
    });

    element.classList.add("active");

    document.getElementById("adminTerpilih").value = admin;

}

async function kirimWhatsapp(){

let username = document.getElementById("username").value;
let nominal = document.getElementById("nominal").value;
let payment = document.getElementById("payment").value;

if(username=="" || nominal=="" || payment==""){

    alert("Lengkapi semua data terlebih dahulu!");

    return;

}

const adminTerpilih = document.getElementById("adminTerpilih").value;

if(adminTerpilih == ""){

    alert("Silakan pilih admin terlebih dahulu!");

    return;

}

let nomor = "";
let admin = "";

if(adminTerpilih == "1"){

    nomor = "6281278363732"; // Nomor Admin May
    admin = "Admin May";

}else if(adminTerpilih == "2"){

    nomor = "6282265057169"; // Nomor Admin Qyuya
    admin = "Admin Qyuya";

}

let pesan =
`Halo ${admin} 👋

Saya ingin Top Up Robux

Username : ${username}
Nominal : ${nominal}
Pembayaran : ${payment}`;

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

    console.log(error);

    alert(error.message);

    return;

}

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

        let hargaPerRobux = 140;

        if (robux >= 5000) {
            hargaPerRobux = 130;
        } else if (robux >= 1000) {
            hargaPerRobux = 135;
        }

        const total = robux * hargaPerRobux;

        customHarga.innerText =
            "Rp" + total.toLocaleString("id-ID");

    });

}
