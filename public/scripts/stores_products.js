function storeProducts(){
    var userSelect = document.getElementById('storeProd').value
    window.location = '/stores_products/filter' + parseInt(userSelect)
}
