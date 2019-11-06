function backButton(e) {
    e.preventDefault();
    window.history.back();
};

function togglePage(id) {
    nav = ['chart', 'trends', 'data', 'map'];
    navLinks = ['chart-nav', 'trends-nav', 'data-nav', 'map-nav'];
    page = document.getElementById(id);
    active = id + '-nav';

    var i;
    for (i = 0; i < nav.length; i++) {
        document.getElementById(nav[i]).style.display = "none";
        document.getElementById(navLinks[i]).classList.remove("active");
      }

    document.getElementById(active).classList.add("active");
    page.style.display = "block";
}

function skipNav() {
     location.href = "data.html";
} 
