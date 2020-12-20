 function WeatherApi() {
    this.getCurrentWeather = async () => {
        try {
            const response = await fetch(weatherUrl);
            const jsonData = await response.json();
            console.log(jsonData);
            return jsonData;
        }catch(error) {
            console.error(error);
        } 
    };
}

function GhentOpenDataApi () {
    this.getCovidPositiveCases = async () => {
        try {
            const response = await fetch(covidUrl);
            const jsonData = await response.json();
            console.log(jsonData);
            return jsonData;
        }catch(error) {
            console.error(error);
        } 
    };
}



