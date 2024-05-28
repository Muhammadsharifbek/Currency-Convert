class Currency {
  #code;
  #rate;
  constructor(code, rate) {
    this.#code = code;
    this.#rate = rate;
  }

  get code() {
    return this.#code;
  }

  get rate() {
    return this.#rate;
  }

  display(container) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${this.code}</td>
      <td>${this.rate}</td>
    `;
    container.appendChild(tr);
  }
}

class CurrencyConverter {
  #currencies;

  constructor(currencies) {
    this.#currencies = currencies;
    this.populateSelect("from-currensy");
    this.populateSelect("to-currensy");
    document.getElementById("convert").addEventListener("click", this.#convert);
  }
  populateSelect(selectId) {
    const selectElement = document.getElementById(selectId);
    this.#currencies.forEach((currency) => {
      const option = document.createElement("option");
      option.value = currency.rate;
      option.label = currency.code;
      selectElement.appendChild(option);
    });
  }

  #convert() {
    const fromCurrency = document.getElementById("from-currensy").value; // Corrected ID
    const toCurrency = parseFloat(document.getElementById("to-currensy").value); // Corrected ID
    const amount = parseFloat(document.getElementById("amount").value);
    const result = (amount * toCurrency) / fromCurrency;
    document.getElementById("result").textContent = `Result: ${result.toFixed(2)}`;
  }
}

class App {
  #list;
  #currencies;

  constructor() {
    this.init();
  }

  async init() {
    this.#list = document.getElementById("table-body");
    const response = await fetch("https://api.frankfurter.app/latest?from=USD");
    const result = await response.json();
    this.transformResult(result);
    this.renderCurrencies();
    this.renderConverter();
  }

  transformResult(result) {
    const { base, rates } = result; // amount removed because it's not in the API response
    const baseCurrency = new Currency(base, 1); // Use 1 as the rate for the base currency
    const otherCurrencies = Object.entries(rates).map(([code, rate]) => new Currency(code, rate));
    this.#currencies = [baseCurrency, ...otherCurrencies]; // Corrected reference here
  }

  renderCurrencies() {
    this.#currencies.forEach((currency) => currency.display(this.#list)); // Corrected reference here
  }

  renderConverter() {
    new CurrencyConverter(this.#currencies);
  }
}

new App();
