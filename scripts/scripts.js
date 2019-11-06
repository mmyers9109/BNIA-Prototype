function showMoreInfo(topic) {
    document.getElementById(topic).style.top = "-200px";
}
function showLessInfo(topic) {
    document.getElementById(topic).style.top = "-700px";
}

// selecting topics
function selectTopic(id) {
   topic = document.getElementById(id);
    if (topic.classList.contains("selected")) {
        topic.classList.remove("selected");
    } else{
        topic.classList.add("selected");
    }
}