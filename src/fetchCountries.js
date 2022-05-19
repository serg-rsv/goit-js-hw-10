const URL = 'https://restcountries.com/v3.1/name/';
const FILTER = '?fields=name,capital,population,flags,languages';

export default function fetchCountries(name) {
  return fetch(`${URL}${name}${FILTER}`)
    .then(response => {
      return response.json();
    })
    .catch(error => {
      console.log(error);
      return error;
    });
}
