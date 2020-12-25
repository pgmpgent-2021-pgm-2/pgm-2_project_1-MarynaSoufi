
const weatherUrl = "http://api.weatherapi.com/v1/current.json?key=9f0a80dc3da94c4db8c151125202012&q=Ghent";
const covidUrl = "https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=";
//const reposUrl = `https://api.github.com/users/${username}/repos?page=1&per_page=50`;
(async () => { 
    const app = {
        async init() {
            this.gitApi = new GitHubApi();
            this.cacheElements();
            await this.fetchWeather();
            await this.fetchCovid();
            await this.fetchPgm();
            await this.registerListeners();
        },
        cacheElements() {
            this.covidQuantity = document.querySelector('.covid-quantity');
            this.weather = document.querySelector('.weather-degree');
            this.weatherImage = document.querySelector('.weather img');
            this.pgmTeam = document.querySelector('.team__person-wrapper');
            this.pgmInfoRepo = document.querySelector('.midle__repo');
        },
        async registerListeners() {
            await this.fetchUserInfo("pgmgent");
            await this.fetchFollowers("dpgmgent");
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
        async fetchUserInfo(username) {
           const dataRepo = await this.gitApi.getReposOfUser(username);
           this.updatePgmRepo(dataRepo);

        },
        async fetchFollowers(username){
            //this.gitFollowers = new GitHubApi();
            const followersData = await this.gitApi.getFollowersOfUser(username);
            this.updatePgmFollower(followersData);
        }, 
        updateWeather(weather) {
            const degree = weather.current.temp_c;
            this.weather.innerText = degree;
            this.weatherImage.src = weather.current.condition.icon;
        },
        updateCovid(covid) {
            const quantity = covid.records;
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
                <div class="team__photo-wrapper" id="${e.portfolio.GitHubUserName}">
                    <img class="team__photo" src="${e.thumbnail}" alt="photo">
                    <span class="team__git-name">${e.portfolio.GitHubUserName}</span>
                </div>
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
        },
        updatePgmRepo(dataRepo) {
            let str = "";
            if(dataRepo.message) {
                console.log(dataRepo.message);
                return;
            }
            dataRepo.forEach((e) => {
                let license;
                let private;
                if (e.license == null) {
                    license = "No licence!";
                }else {
                    license = e.license.key;
                }
                if (e.private == true) {
                    private = "private";
                }else {
                    private = "public";
                }
                str += `<div class="repo__wrapper"><h4>${e.full_name}</h4><div class="repo__descr">${e.description}</div><div class="repo__other">${e.size} KB <svg  height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path class="color" fill-rule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"></path></svg> ${e.default_branch} <svg class="octicon octicon-law mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path  class="color" fill-rule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z"></path></svg> ${license} <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path class="color" fill-rule="evenodd" d="M7.467.133a1.75 1.75 0 011.066 0l5.25 1.68A1.75 1.75 0 0115 3.48V7c0 1.566-.32 3.182-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.7 1.7 0 01-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.182 1 8.566 1 7V3.48a1.75 1.75 0 011.217-1.667l5.25-1.68zm.61 1.429a.25.25 0 00-.153 0l-5.25 1.68a.25.25 0 00-.174.238V7c0 1.358.275 2.666 1.057 3.86.784 1.194 2.121 2.34 4.366 3.297a.2.2 0 00.154 0c2.245-.956 3.582-2.104 4.366-3.298C13.225 9.666 13.5 8.36 13.5 7V3.48a.25.25 0 00-.174-.237l-5.25-1.68zM9 10.5a1 1 0 11-2 0 1 1 0 012 0zm-.25-5.75a.75.75 0 10-1.5 0v3a.75.75 0 001.5 0v-3z"></path></svg> ${private} <svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path class="color" fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>${e.forks_count} <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path class="color" fill-rule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"></path></svg> ${e.open_issues} <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path class="color" fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path></svg> ${e.watchers} <a href="${e.html_url}"><svg height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path class="color" fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path></svg></a></div></div>`;
            });
            this.pgmInfoRepo.innerHTML = str;
        },
        updatePgmFollower(followersData) {
            const followers = document.querySelector('.midle__team-followers');
            str = "";
            if(followersData == 0) {
                str = "Geen volgers!";
                followers.textContent = str;
            }else {
                followersData.forEach((e) => {
                    str += `<div><img src="${e.avatar_url}"><span>${e.login}</span></div>`;
                });
                followers.innerHTML = str;
            }

        },
        updateTeamInfo() {
            const elements = documemt.querySelectorAll('.team__photo-wrapper');
            elements.forEach((e) => {
                e.addEventListener('click',fetchUserInfo(e.id));

            })
            


        }
        
       
    };
    await app.init();

})();