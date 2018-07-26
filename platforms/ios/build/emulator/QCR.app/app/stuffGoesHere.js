var createViewModel = require("./main-view-model").createViewModel;
const Button = require("tns-core-modules/ui/button").Button;
const Page = require("tns-core-modules/ui/page").Page;
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
const fromObject = require("data/observable").fromObject;

const httpModule = require("http");
var geolocation = require("nativescript-geolocation");


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

            const viewModel = fromObject({
                locations: []
            })

            for(var i=0; i<=someStuff.result.length-1; i++){
                viewModel.locations.push(someStuff.result[i]);
            }

            page.bindingContext = viewModel;

        }, (e) => {
        });

    }, function(e){});
}

function onItemTap(address){
    var add = this.address;

}

exports.onNavigatingTo = onNavigatingTo;

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