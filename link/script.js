document.addEventListener("DOMContentLoaded",()=>{

    const tombol=document.querySelectorAll(".btn");

    tombol.forEach((btn,index)=>{

        btn.style.opacity="0";
        btn.style.transform="translateY(30px)";

        setTimeout(()=>{

            btn.style.transition=".5s";
            btn.style.opacity="1";
            btn.style.transform="translateY(0)";

        },index*200);

    });

});