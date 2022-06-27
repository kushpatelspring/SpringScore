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

function displayLoader(){
  setTimeout(function() {
    $('#loader-wrapper').fadeOut();
    $(".start-button").css("display", "block");
    $("#springscore-text").css("display", "block");
}, 3000);
}

function displayResults(){
  $('.popup-wrap').fadeIn(500);
  $('.popup-box').removeClass('transform-out').addClass('transform-in');
}

function getURLs(){
  var youtubeURL = document.getElementById("youtube-url").value;
  var instagramURL = document.getElementById("instagram-url").value;
  var tiktokURL = document.getElementById("tiktok-url").value;
  var twitchURL = document.getElementById("twitch-url").value;
  return [youtubeURL, instagramURL, tiktokURL, twitchURL]
}

function getSubscribers(){
  var youtubeSubscribers = parseInt(document.getElementById("youtube-subscribers").value);
  var instagramFollowers = parseInt(document.getElementById("instagram-followers").value);
  var tiktokFollowers = parseInt(document.getElementById("tiktok-followers").value);
  var twitchSubscribers = parseInt(document.getElementById("twitch-subscribers").value);
  return [youtubeSubscribers, instagramFollowers, tiktokFollowers, twitchSubscribers]
}

function getPrimaryPlatform(){
  var primaryPlatformCard = window.sessionStorage.getItem("primaryPlatform");
  var primaryPlatform = "";
  if (primaryPlatformCard != null){
    primaryPlatform = primaryPlatformCard.replace("-icon-box", "");
  }
  return primaryPlatform
}

function getTotalViews(){
  var totalViews = $('.total-views').text(); //text range
  var medianTotal = 0
  if (totalViews == "0 - 100k"){
    medianTotal = 50000;
  }else if(totalViews == "100k - 500k"){
    medianTotal = 300000;
  }else if(totalViews == "500k - 1 million"){
    medianTotal = 750000;
  }else if(totalViews == "1 - 100 million"){
    medianTotal = 50000000;
  }else if(totalViews == "100 - 500 million"){
    medianTotal = 300000000;
  }else if(totalViews == "500 - 1 billion"){
    medianTotal = 750000000;
  }else if(totalViews == "1+ billion"){
    medianTotal = 1000000000;
  }
  return medianTotal
}

function getTimeActive(){
  var timeActive = $('.time-active').text();
  var medianTime = 0;
  if (timeActive == "0 - 6 months"){
    medianTime = 3;
  }else if(timeActive == "6 - 12 months"){
    medianTime = 9;
  }else if(timeActive == "1 - 2 years"){
    medianTime = 18;
  }else if(timeActive == "2 - 4 years"){
    medianTime = 36;
  }else if(timeActive == "4+ years"){
    medianTime = 48;
  }
  return medianTime
}

function getDomainChoice(){
  var domainChoice = $('.custom-domain').text();
  var domainVal = 0;
  //Convert domain choice to 1 or 0 (true or false)
  if(domainChoice == "Yes"){
    domainVal = 1;
  }else if(domainChoice == "No"){
    domainVal = 0;
  }
  return domainVal
}

function getPlatformPoints(urls){
  var numPoints = 0
  for (var i = 0; i < urls.length; i++){
    if(urls[i] != ""){
      numPoints+=1;
    }
  }
  return numPoints
}

function getPrimaryPlatformPoints(primaryPlatform){
  primaryPoints = 0;
  if (primaryPlatform == "youtube"){
    primaryPoints = 5;
  }else if (primaryPlatform == "instagram"){
    primaryPoints = 5;
  }else if (primaryPlatform == "tiktok"){
    primaryPoints = 2;
  }else if (primaryPlatform == "twitch"){
    primaryPoints = 2;
  }
  return primaryPoints
}

function getTotalViewsPoints(views){
  var numPoints = 0;
  if (totalViews == 50000){
    numPoints = 5;
  }else if (totalViews == 300000){
    numPoints = 10;
  }else if (totalViews == 750000){
    numPoints = 20;
  }else if (totalViews == 50000000){
    numPoints = 30;
  }else if (totalViews == 300000000){
    numPoints = 50;
  }else if (totalViews == 750000000){
    numPoints = 70;
  }else if (totalViews == 1000000000){
    numPoints = 100;
  }
  return numPoints
}

function calculateSpringScore(){
  
  displayLoader();

  var numPoints = 0;

  var urls = getURLs(); // [youtube, instagram, tiktok, twitch]
  var subscribers = getSubscribers(); // [youtube, instagram, tiktok, twitch]
  var primaryPlatform = getPrimaryPlatform(); // "youtube"
  var totalViews = getTotalViews(); // median total
  var timeActive = getTimeActive(); // median time
  var domainChoice = getDomainChoice(); // 1 or 0 

  numPoints+=getPlatformPoints(urls); // points per platform
  numPoints+=getPrimaryPlatformPoints(primaryPlatform); //points for primary platform
  numPoints+=getTotalViewsPoints(totalViews) // points for total views

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
  // 0:youtube, 1:instagram, 2:tiktok, 3:twitch
  // submitUser(
  //   urls[0], 
  //   urls[1], 
  //   urls[2], 
  //   urls[3], 
  //   subscribers[0], 
  //   subscribers[1], 
  //   subscribers[2], 
  //   subscribers[3], 
  //   primaryPlatform, 
  //   totalViews, 
  //   timeActive, 
  //   domainChoice, 
  //   numPoints);

  displayResults();

}

