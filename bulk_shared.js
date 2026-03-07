async function load(mobile = true) {
    try {
        /*if(mobile){
            const input_json = localStorage.getItem("userBSignsFromMobile");
        }
        else{
            const input_json = localStorage.getItem("userFavorites");
        }*/


        let input_json = document.getElementById("stor-input").value;


        if (!input_json.trim()) {
            try {
                input_json = await navigator.clipboard.readText();
                if (!input_json.trim()) {
                    throw new Error("Clipboard is empty or contains invalid data.");
                }
            } catch (clipboardError) {
                throw new Error("Failed to read from clipboard: " + clipboardError.message);
            }
        }
        
        loadSigns(input_json);

    } catch (error) {
        show_error_popup(error);
        throw(error);
    }
}

function loadFromSectionScan(){
    if(window.location.pathname.endsWith("bulk_b.html")){
        loadSigns(localStorage.getItem('qsb_bSigns'));
    }
    else{
        loadSigns(localStorage.getItem('qsb_cSigns'));
    }

    document.querySelector('#switch-size').href += '?loadFromSectScan=true';
    document.querySelector('#go-home').href += '?loadFromSectScan=true';

    // hide these, dont want to confuse the user
    document.querySelector('#stor-input').style.display = 'none';
    document.querySelector('#load-btn').style.display = 'none'

}

function loadSigns(input_json){
        // Parse the JSON input
        const jsonData = JSON.parse(input_json);
        let add_section_header = null;
        jsonData.forEach(element => {
            // Check if we've defined a section header in the QuickSign screen
            if(element[20])
            {
                // Save this to be added with the next sign
                add_section_header = element[2];
                return;
            }
            if (element[1] === 'on') {
                element[1] = 'off';
            } else {
                element[1] = 'on';
            }
            // call the create_sign function from bulk_X.html
            create_sign(element, add_section_header);
            // reset this to null now that we've used the header already
            add_section_header = null;
        
        });
}

// Check if ?load=true -- if it is then we'll automatically grab it from the clipboard
window.addEventListener('load', async () => {
    const queryParams = new URLSearchParams(window.location.search)

    if (queryParams.get('load')){
        await load();
    }

    if(queryParams.get('loadFromSectScan')){
        loadFromSectionScan();
    }

    const today = new Date();
    const saturday = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    onSaleThru = `ON SALE THRU ${saturday.toLocaleDateString("en-US")}`;
    document.querySelector('#sale-date').value = onSaleThru;
})

function show_error_popup(msg) {
    document.getElementById("error-popup-wrap").classList.add("showing");
    document.getElementById("error-msg").innerHTML = msg;
}
function hide_error_popup() {
    document.getElementById("error-popup-wrap").classList.remove("showing");
}

function show_print_dialog(){
    document.getElementById("print-dialog").classList.add("showing");

    let actualPagesCount = 0;

    for(const child of document.getElementById('print-container').children){
        if(!child.classList.contains('hidden')) actualPagesCount++;
    };

    if(actualPagesCount === 0){
        show_error_popup("You have not yet imported any signs.");
        document.getElementById('print-dialog').classList.remove('showing');
        return;
    }
    
    save();
    
    document.getElementById("print-dialog").querySelectorAll('#print-count').forEach(element => element.innerHTML = actualPagesCount);
}

function confirm_print(){
    document.getElementById("print-dialog").classList.remove("showing");
    window.print();
}

function cancel_print(){
    document.getElementById("print-dialog").classList.remove("showing");
}

 function save() {
            let signinfo = {
                "name": document.querySelector('#mainDescription').value,
                "description": document.querySelector('#altDescription input').value,
                "retail": document.querySelector('#retail-price-input').value,
                "sale": document.querySelector('#sale-price-input').value,
                "onsale": document.querySelector('#on-sale-sel').checked,
                "xforx0": document.querySelector('#sale-price-input-xforx1').value,
                "xforx1": document.querySelector('#sale-price-input-xforx2').value,
                "bogo": document.querySelector('#price-type-sel').value,    
                "unit": document.querySelector('#unit-type-sel').value,
                "unitsizes": document.querySelector('#unit-sizes').value,
                "wyb": document.querySelector('#MustBuyInner input').value,
                "mam": document.querySelector('#mixMatch').value,
                "timestamp": new Date().toISOString()
            }
            if (signinfo.name.trim() === '') {
                return;
            }
            localStorage.getItem('savedSigns') ? 
                localStorage.setItem('savedSigns', JSON.stringify([...JSON.parse(localStorage.getItem('savedSigns')), signinfo])) :
                localStorage.setItem('savedSigns', JSON.stringify([signinfo]));
        }