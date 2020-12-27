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
function UserApi () {
    this.getUsers = async () => {
        try {
            const response = await fetch("../app/static/data/pgm.json");
            const jsonData = await response.json();
            console.log(jsonData);
            return jsonData;
        }catch(error) {
            console.error(error);
        } 
    };
}
function GitHubApi () {
    this.getReposOfUser = async (username) => {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?page=1&per_page=50`);
            const dataRepo = await response.json();
            console.log(dataRepo);
            return dataRepo;
        }catch(error) {
            console.error(error);
        } 
    },
    this.getFollowersOfUser = async (username) => {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/followers?page=1&per_page=100`);
            const dataFollower = await response.json();
            console.log(dataFollower);
            return dataFollower;
        }catch(error) {
            console.error(error);
        } 
    },
    this.getUsersByName = async (name) => {
        try{
            const response = await fetch(`https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=${name}`);
            const users = await response.json();
            return users;
        } catch(error) {
            console.error(error);
        }
    }

}



