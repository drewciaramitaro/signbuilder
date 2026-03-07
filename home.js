// Check if ?load=true -- if it is then we'll automatically grab it from the clipboard
window.addEventListener('load', async () => {
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.get('load')){
        await loadQSData();
    }

    if(queryParams.get('loadFromSectScan')){
        document.querySelector('#go-to-b').href = 'bulk_b.html?loadFromSectScan=true'
        document.querySelector('#go-to-c').href = 'bulk_c.html?loadFromSectScan=true'

        document.querySelector('#success').style.display = 'block';
        document.querySelector('#b-count').innerHTML = `${JSON.parse(localStorage.getItem('qsb_bSigns')).length} B-Size Signs`
        document.querySelector('#c-count').innerHTML = `${JSON.parse(localStorage.getItem('qsb_cSigns')).length} C-Size Signs`
    }


})


async function loadQSData(){
    try{
        document.querySelector('#print-dialog').classList.add('showing');
        try {
            input_json = await navigator.clipboard.readText();
            if (!input_json.trim()) {
                throw new Error("Clipboard is empty or contains invalid data.");
            }
        } catch (clipboardError) {
            throw new Error("Failed to read from clipboard: " + clipboardError.message);
        }

        const jsonData = JSON.parse(input_json);
        let b_signs = [];
        let c_signs = [];
        const edit_template = document.querySelector("#adv-edit-item")
        jsonData.forEach(element => {
            const newItem = edit_template.content.cloneNode(true);
            
            newItem.querySelector("#name").innerHTML = element[2];
            document.querySelector("#adv-edit").appendChild(newItem);

            if(element[20] === true){
                b_signs.push(element);
                c_signs.push(element);
            }
            else if(element[11] === "B"){
                b_signs.push(element);
            }
            else if (element[11] == "C")
            {
                c_signs.push(element);
            }
            else{
                throw new Error("Invalid sign data found!");
            }
        });
        
        

        localStorage.setItem("qsb_bSigns", JSON.stringify(b_signs))
        localStorage.setItem("qsb_cSigns", JSON.stringify(c_signs))

        document.querySelector('#go-to-b').href = 'bulk_b.html?loadFromSectScan=true'
        document.querySelector('#go-to-c').href = 'bulk_c.html?loadFromSectScan=true'

        document.querySelector('#success').style.display = 'block';
        document.querySelector('#bulk-size').style.display = 'flex';
        document.querySelector('#b-count').innerHTML = `${b_signs.length} B-Size Signs`
        document.querySelector('#c-count').innerHTML = `${c_signs.length} C-Size Signs`

        document.querySelector('#print-dialog').classList.remove('showing');
    }
    catch (error){
        document.querySelector('.error-popup h3').innerHTML = "Error loading signs.";
        document.querySelector('.error-popup h4').innerHTML = error.message;
        throw error;
    }
}