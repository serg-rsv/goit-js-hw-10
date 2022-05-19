import './css/styles.css';
import fetchCountries from './fetchCountries';
import { debounce, trim } from 'lodash';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onsearchBox, DEBOUNCE_DELAY));

function onsearchBox() {
  const countryName = trim(refs.searchBox.value);

  if (countryName === '') {
    clearOutput();
    return;
  }

  fetchCountries(countryName)
    .then(country => {
      if (country.status === 404) {
        clearOutput();
        throw 'Oops, there is no country with that name';
      }

      if (country.length > 10) {
        clearOutput();

        Notify.info('Too many matches found. Please enter a more specific name.', {
          timeout: 6000,
        });
        return;
      } else if (country.length > 1 && country.length < 10) {
        renderCountryList(country);
        return;
      } else {
        renderCountryInfo(country[0]);
      }
    })
    .catch(message =>
      Notify.failure(message, {
        timeout: 6000,
      }),
    );
}

function renderCountryList(country) {
  clearOutput();

  const markupList = country
    .map(({ name: { official }, flags: { svg } }) => {
      return `
    <li class="country-item">
      <img class="country-flag" src="${svg}" alt="flag of ${official}" width="32px"/>
      <p class="country-name">${official}</p>
    </li>
  `;
    })
    .join('');

  refs.countryList.insertAdjacentHTML('afterbegin', markupList);
}

function renderCountryInfo(country) {
  clearOutput();

  const {
    name: { official },
    capital,
    population,
    flags: { svg },
    languages,
  } = country;

  const langs = Object.values(languages).join(', ');

  const markupCard = `
    <div class="title">
      <img class="country-flag" src="${svg}" alt="flag of ${official}" width="32px" />
      <p class="country">${official}</p>
    </div>
    <p class="property">Capital: <span class="value">${capital}</span></p>
    <p class="property">Population: <span class="value">${population}</span></p>
    <p class="property">Languages: <span class="value">${langs}</span></p>
  `;

  refs.countryInfo.insertAdjacentHTML('afterbegin', markupCard);
}

function clearOutput() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
