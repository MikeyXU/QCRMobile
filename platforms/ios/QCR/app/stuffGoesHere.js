var createViewModel = require("./main-view-model").createViewModel;
const Button = require("tns-core-modules/ui/button").Button;
const Page = require("tns-core-modules/ui/page").Page;
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
const fromObject = require("data/observable").fromObject;

const httpModule = require("http");
var geolocation = require("nativescript-geolocation");
var Directions = require("nativescript-directions").Directions;

var utilsModule = require("tns-core-modules/utils/utils");

const viewModel = fromObject({
    locations: []
})

function onNavigatingTo(args) {
    var page = args.object;

    geolocation.enableLocationRequest().then(function () {
    }, function (e) {
        console.log("Error: " + (e.message || e));
    });

    var location = geolocation.getCurrentLocation().then(function(loc){

        var a = loc.latitude;
        var b = loc.longitude;

        httpModule.request({
            url: "https://community-hubb.herokuapp.com/locations/api/test/",
            method: "POST",
            headers: { "Content-Type": "application/json" },
            content: JSON.stringify({
                lat: JSON.stringify(a),
                long: JSON.stringify(b)
            })
        }).then((response) => {
            var rec = response.content.toJSON();

            var someStuff = JSON.parse(response.content);

            for(var i=0; i<=someStuff.result.length-1; i++){
                viewModel.locations.push(someStuff.result[i]);
            }

            page.bindingContext = viewModel;

        }, (e) => {
        });

    }, function(e){});
}

function onItemTap(args){
    
    var directions = new Directions();
    var add = args.object.info;
    directions.navigate({
        to:{
            address: add
        }
    }).then(function(){console.log("Maps launched"),function(error){console.log(error);}});
}

function websiteTap(args){

    var webAddress = args.object.info2;
    utilsModule.openUrl(webAddress);

}

exports.onNavigatingTo = onNavigatingTo;
exports.onItemTap = onItemTap;
exports.websiteTap = websiteTap;

/*function populateArray(array){

    httpModule.getJSON("https://community-hubb.herokuapp.com/locations/api/39.1494/-84.4745").then(function(response){
        console.log(response);
        result = response.content.toJSON();
    }, function(e){
        result = JSON.stringify(e);
    });

    var jsonData = JSON.parse(result);
    console.log(jsonData);
    
}
*/