function getUnitSuffix(unitType) {
    let suffix = "each";
    switch (unitType) {
        case "POUND":
            suffix = "per lb.";
            break;
        case "QUART":
            suffix = "per qt.";
            break;
        case "50 COUNT":
            suffix = "per 50 sq ft.";
            break;
        case "100 COUNT":
            suffix = "per 100 ct.";
            break;
        case "OUNCE":
            suffix = "per oz.";
            break;
        case "DOZEN":
            suffix = "per dozen"
    }
    return suffix;
}

function getUnit(unitType){
    switch(unitType){
        case "POUND":
            return "oz.";
        case "QUART":
            return "fl. oz.";
        case "50 COUNT":
            return "sq. ft.";
        case "100 COUNT":
            return "ct.";
        case "OUNCE":
            return "oz.";
        case "DOZEN":
            return "ct."
    }
}

function calcUnitPrice(unitSize, unitType, salePrice, retailPrice, priceType, xForX) {
    switch (priceType) {
        case "forOne":
        case "forTwo":
            salePrice /= xForX;
            break;
        case "ten":
            salePrice = 1;
            break;
        case "bogo":
            salePrice = retailPrice / 2;
            break;
        case "b2g1":
            salePrice = retailPrice * 0.75;
            break;
        case "b2g2":
            salePrice = retailPrice / 2;
            break;
        case "b1g2":
            salePrice = retailPrice / 3;
            break;
    }

    let modifier = 1;
    switch (unitType) {
        case "POUND":
            modifier = 16;
            break;
        case "QUART":
            modifier = 32;
            break;
        case "50 COUNT":
            modifier = 50;
            break;
        case "100 COUNT":
            modifier = 100;
            break;
        case "OUNCE":
            modifier = 1;
            break;
        case "DOZEN":
            modifier = 12;
            break;
        default:
            break;
    }
    return ((salePrice / unitSize) * modifier).toFixed(2);
}

document.querySelectorAll('input').forEach(e=>{
    e.addEventListener('input', function(t) {
        t.target.value = t.target.value.replace('*', '•');
    })
});