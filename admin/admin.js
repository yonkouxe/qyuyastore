const SUPABASE_URL = "https://bsrtlctpzojkxecfhwih.supabase.co";
const SUPABASE_KEY = "sb_publishable_XKwCq1BJkFhyNXNdJrBo9g_xVK7VnGF";


const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
    
let semuaOrders = [];
let filterAktif = "Semua";

// ===============================
// LOAD ORDER
// ===============================

async function loadOrders(){

    const { data, error, count } = await sb
    .from("orders")
    .select("*", { count: "exact" });

console.log(data);
console.log(count);
console.log(error);

    if(error){
        console.log(error);
        return;
    }

    semuaOrders = data;

    try{
        tampilkanOrders(data);
    }catch(err){
        console.log("TAMPILKAN ERROR:", err);
    }

}

// ===============================
// TAMPILKAN ORDER
// ===============================

function tampilkanOrders(data){


    const orders =
    document.getElementById("orders");
    orders.innerHTML = "";


    let total = data.length;
    let pending = 0;
    let selesai = 0;
    let omzet = 0;



    data.forEach(order=>{


        if(order.status === "Pending"){

            pending++;

        }else{

            selesai++;

        }



        const hasil =
        order.produk.match(/Rp([\d\.]+)/);



        if(hasil){

            omzet += parseInt(
                hasil[1].replace(/\./g,"")
            );

        }



        orders.innerHTML += `

        <div class="card">


            <h3>${order.username}</h3>


            <p>🎮 ${order.produk}</p>


            <p>💳 ${order.pembayaran}</p>


            <p>👤 ${order.admin}</p>


            <span class="status ${
                order.status=="Pending"
                ?"pending"
                :"success"
            }">

                ${order.status}

            </span>



            <div class="actions">


                <button
                class="btn done"
                onclick="selesaikanOrder('${order.id}')">

                ✓

                </button>



                <button
                class="btn delete"
                onclick="hapusOrder('${order.id}')">

                🗑

                </button>


            </div>


        </div>

        `;


    });



    document.getElementById("totalOrder")
    .innerText = total;


    document.getElementById("pendingOrder")
    .innerText = pending;


    document.getElementById("selesaiOrder")
    .innerText = selesai;


    document.getElementById("omzet")
    .innerText =
    "Rp" + omzet.toLocaleString("id-ID");


}



// ===============================
// SELESAIKAN ORDER
// ===============================

async function selesaikanOrder(id){

    // Ambil data order
    const { data: order } = await sb
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

    // Ubah status menjadi selesai
    await sb
        .from("orders")
        .update({
            status:"Selesai"
        })
        .eq("id",id);

    // Ambil stok sekarang
    const { data: setting } = await sb
        .from("settings")
        .select("robux_stock")
        .eq("id",1)
        .single();

    loadOrders();

}



// ===============================
// HAPUS ORDER
// ===============================

async function hapusOrder(id){


    if(!confirm("Hapus order ini?"))
    return;



    await sb
    .from("orders")
    .delete()
    .eq("id",id);



    loadOrders();


}

// ===============================
// SEARCH
// ===============================

const searchAccount = document.getElementById("searchAccount");


if(searchAccount){

    searchAccount.addEventListener("input",function(){

        const keyword =
        this.value.toLowerCase();


        const cards =
        document.querySelectorAll(".account-card");


        cards.forEach(card=>{


            const username =
            card.querySelector(".username")
            .innerText
            .toLowerCase();



            if(username.includes(keyword)){


                card.style.display="block";


            }else{


                card.style.display="none";


            }


        });


    });

}

// ===============================
// FILTER
// ===============================

function filterStatus(status){


    filterAktif = status;


    let hasil = semuaOrders;



    if(status !== "Semua"){


        hasil =
        semuaOrders.filter(order=>

            order.status === status

        );


    }



    tampilkanOrders(hasil);


}
// ===============================
// LOGOUT
// ===============================

async function logout(){


    await sb.auth.signOut();


    window.location.href="index.html";


}

loadOrders();
