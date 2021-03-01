// function searchStore(){
//     var name = document.getElementById('store_name').value + document.getElementById('state').value;
//     window.location = '/stores/search/' + encodeURI(name);
// }

function deleteStore(id){
    $.ajax({
        url: '/stores/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};