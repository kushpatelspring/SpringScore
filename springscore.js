var app = new Realm.App({ id: "springscorev1-tlpyo" });
var credentials = Realm.Credentials.anonymous();
try {
  const user = app.logIn(credentials);
} catch(err) {
  console.error("Failed to log in", err);
}


$(document).ready(function(){


  $(".icon-box").click(function(){
      platformSelected = $(this).attr('id');
      currPlatform = window.sessionStorage.getItem("primaryPlatform");
      if (currPlatform == null){
        window.sessionStorage.setItem("primaryPlatform", platformSelected);
        $("#"+platformSelected).css("border", "2px solid white");
      }else{
        $("#"+currPlatform).css("border", "0.5px solid white");
        $("#"+platformSelected).css("border", "2px solid white");
        window.sessionStorage.setItem("primaryPlatform", platformSelected);
      }
  });


  $('.popup-close').click(function(e) {
    $('.popup-wrap').fadeOut(500);
    $('.popup-box').removeClass('transform-in').addClass('transform-out');

    e.preventDefault();
  });


  $(".range-tier").click(function(){
    $('.time-active').text($(this).html());
  });

  $(".domain-tier").click(function(){
    $('.custom-domain').text($(this).html());
  });

  $(".view-tier").click(function(){
    $('.total-views').text($(this).html());
  });



});

function submitUser(youtubeURL, instagramURL, tiktokURL, twitchURL, youtubeSubscribers, instagramFollowers, tiktokFollowers, twitchSubscribers, primaryPlatform, totalViews, timeActive, domainChoice, numPoints){
    mongodb = app.currentUser.mongoClient("mongodb-atlas");
    v1data = mongodb.db("SpringScore").collection("v1");
    v1data.insertOne({
      youtubeURL: youtubeURL,
      instagramURL: instagramURL,
      tiktokURL: tiktokURL,
      twitchURL: twitchURL,
      youtubeSubscribers: youtubeSubscribers,
      instagramFollowers: instagramFollowers,
      tiktokFollowers: tiktokFollowers,
      twitchSubscribers: twitchSubscribers,
      primaryPlatform: primaryPlatform,
      totalViews: totalViews,
      timeActive: timeActive,
      domainChoice: domainChoice,
      springScore: numPoints
    });
  }

 function calculateSpringScore(){

  setTimeout(function() {
       $('#loader-wrapper').fadeOut();
       $(".start-button").css("display", "block");
       $("#springscore-text").css("display", "block");
  }, 3000);


  var numPoints = 0;

  var youtubeURL = document.getElementById("youtube-url").value;
  var instagramURL = document.getElementById("instagram-url").value;
  var tiktokURL = document.getElementById("tiktok-url").value;
  var twitchURL = document.getElementById("twitch-url").value;

  var youtubeSubscribers = document.getElementById("youtube-subscribers").value;
  var instagramFollowers = document.getElementById("instagram-followers").value;
  var tiktokFollowers = document.getElementById("tiktok-followers").value;
  var twitchSubscribers = document.getElementById("twitch-subscribers").value;

  var primaryPlatformCard = window.sessionStorage.getItem("primaryPlatform");
  var primaryPlatform = "";
  if (primaryPlatformCard != null){
    primaryPlatform = primaryPlatformCard.replace("-icon-box","");
  }
  // var creatorRange = window.sessionStorage.getItem("averageCreatorRange");
  // var domainChoice = window.sessionStorage.getItem("domainChoice"); //yes-domain or no-domain
  var totalViews = $('.total-views').text(); //text range
  var timeActive = $('.time-active').text();
  var domainChoice = $('.custom-domain').text();

  $('.popup-wrap').fadeIn(500);
  $('.popup-box').removeClass('transform-out').addClass('transform-in');

  //Number of platforms -> Points
  if (youtubeURL != ""){
    numPoints+=1;
  }
  if (instagramURL != ""){
    numPoints+=1;
  }
  if (tiktokURL != ""){
    numPoints+=1;
  }
  if (twitchURL != ""){
    numPoints+=1;
  }

  //Primary platform -> Points
  if (primaryPlatform == "youtube"){
    numPoints += 5;
  }else if (primaryPlatform == "instagram"){
    numPoints += 5;
  }else if (primaryPlatform == "tiktok"){
    numPoints += 2;
  }else if (primaryPlatform == "twitch"){
    numPoints += 2;
  }

  //Total views -> Points
  if (totalViews == "0 - 100k"){
    numPoints += 5;
  }else if (totalViews == "100k - 500k"){
    numPoints += 10;
  }else if (totalViews == "500k - 1 million"){
    numPoints += 20;
  }else if (totalViews == "1 - 100 million"){
    numPoints += 30;
  }else if (totalViews == "100 - 500 million"){
    numPoints += 50;
  }else if (totalViews == "500 - 1 billion"){
    numPoints += 70;
  }else if (totalViews == "1+ billion"){
    numPoints += 100;
  }

  //KNN model -> Points
  numPoints = 180;

  //return range
  if (numPoints <= 50){
    $('#springscore-results').text("up to $1,000");
  }else if (numPoints <= 75){
    $('#springscore-results').text("$1,000 - $10,000");
  }else if (numPoints <= 100){
    $('#springscore-results').text("$10,000 - $25,000");
  }else if (numPoints <= 120){
    $('#springscore-results').text("$25,000 - $50,000");
  }else if (numPoints <= 140){
    $('#springscore-results').text("$50,000 - $100,000");
  }else if (numPoints <= 190){
    $('#springscore-results').text("$100,000 - $200,000");
  }else{
    $('#springscore-results').text("over $200,000");
  }

  // submitUser(youtubeURL, instagramURL, tiktokURL, twitchURL, youtubeSubscribers, instagramFollowers, tiktokFollowers, twitchSubscribers, primaryPlatform, totalViews, timeActive, domainChoice, numPoints);

}

