
const weatherUrl = "http://api.weatherapi.com/v1/current.json?key=9f0a80dc3da94c4db8c151125202012&q=Ghent";
const covidUrl = "https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=";
(() => {
 
    const app = {
        init() {
            this.cacheElements();
            this.fetchWeather();
            this.fetchCovid();
            this.fetchPgm();
           

        },
        cacheElements() {
            this.covidQuantity = document.querySelector('.covid-quantity');
            this.weather = document.querySelector('.weather-degree');
            this.weatherImage = document.querySelector('.weather img');
            this.pgmTeam = document.querySelector('.team__person-wrapper');
        },
        async fetchWeather() {
            this.weatherApi = new WeatherApi();
            const jsonData = await this.weatherApi.getCurrentWeather();
            this.updateWeather(jsonData);   
            setInterval(async (ev) => {
                await this.updateWeather(jsonData);
              }, 30000);
        },  
        async fetchCovid() {
            this.covidApi = new GhentOpenDataApi();
            const jsonData = await this.covidApi.getCovidPositiveCases();
            this.updateCovid(jsonData);
            setInterval(async (ev) => {
                await this.updateCovid(jsonData);
              }, 30000);
        },
        async fetchPgm() {
            this.pgmApi = new UserApi();
            const jsonData = await this.pgmApi.getUsers();
            this.updatePgm(jsonData);            
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
        },
        updatePgm(pgmData) {
            const pgm = pgmData.team;
            console.log(pgm);
            let str = "";
            pgm.forEach((e) => {
                str += `<li>
                <a class="team__photo-wrapper">
                    <img class="team__photo" src="${e.thumbnail}" alt="photo">
                    <span class="team__git-name">${e.portfolio.GitHubUserName}</span>
                </a>
                <span class="team__name">${e.name} ${e.surname}</span>
            </li>`;
            });
            this.pgmTeam.innerHTML = str;
            //full_name
            //description
            //size
            //default_branch
            //license.key
            //private
            //forks_count
            //open_issues
            //watchers
            //url

        }
    }
    app.init();

})();