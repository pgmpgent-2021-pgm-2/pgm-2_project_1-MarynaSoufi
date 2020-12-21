
const weatherUrl = "http://api.weatherapi.com/v1/current.json?key=9f0a80dc3da94c4db8c151125202012&q=Ghent";
const covidUrl = "https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=";
(() => {
 
    const app = {
        init() {
            this.cacheElements();
            this.fetchWeather();
            this.fetchCovid();
           

        },
        cacheElements() {
            this.covidQuantity = document.querySelector('.covid-quantity');
            this.weather = document.querySelector('.weather-degree');
            this.weatherImage = document.querySelector('.weather img');
        },
        async fetchWeather() {
            this.weatherApi = new WeatherApi();
            const jsonData = await this.weatherApi.getCurrentWeather();
            this.updateWeather(jsonData);   
        },  
        async fetchCovid() {
            this.covidApi = new GhentOpenDataApi();
            const jsonData = await this.covidApi.getCovidPositiveCases();
            this.updateCovid(jsonData);
        },
        updateWeather(weather) {
            const degree = weather.current.temp_c;
            this.weather.innerText = degree;
            this.weatherImage.src = weather.current.condition.icon;
        },
        updateCovid(covid) {
            const quantity = covid.records;
            console.log(quantity);
            let str = "";
            for(let i of quantity) {
                str = `${i.fields.cases}`;
            }
            this.covidQuantity.innerText = str;
        }
    }
    app.init();

})();