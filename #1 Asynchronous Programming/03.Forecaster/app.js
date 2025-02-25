function attachEvents() {
  let currentForecastDiv = document.querySelector("#current");
  let upcomingForecastDiv = document.querySelector("#upcoming");
  let forecastDiv = document.getElementById("forecast");
  let sumbitEl = document.querySelector("#submit");
  let locationEl = document.querySelector("#location");
  let symbolSpan = "";
  const weatherSymbols = [`&#x2600`, `&#x26C5`, `&#x2601`, `&#x2614`, `&#176`];

  sumbitEl.addEventListener("click", async () => {
    let locationRef = document.getElementById("location");
    let fullPath = `http://localhost:3030/jsonstore/forecaster/locations`;

    try {
      const response = await fetch(fullPath);
      const data = await response.json();
      renderData(data);
      locationEl.value = "";
    } catch (error) {
      currentForecastDiv.textContent = "Error";
      currentForecastDiv.style.cssText =
        "display:block; font-size:72px;tex-align:center";
    }

    function renderData(data) {
      data.forEach(async (element) => {
        let { name, code } = element;

        let currConditionsPath = `http://localhost:3030/jsonstore/forecaster/today/${code}`;
        let upcomConditionsPath = `http://localhost:3030/jsonstore/forecaster/upcoming/${code}`;

        try {
          const currentDayResponse = await fetch(currConditionsPath);
          const currDayData = await currentDayResponse.json();
          renderCurrCondition(currDayData);

          const responseInThreedays = await fetch(upcomConditionsPath);
          const dataForThreeDays = await responseInThreedays.json();

          renderUpcomCondition(dataForThreeDays);
        } catch (error) {
          throw error;
        }
      });

      function renderCurrCondition(data) {
        let { forecast, name } = data;
        forecastDiv.style.display = "block";
        let conditionsDiv = createElementWithClass("div", "forecasts");
        symbolSpan = createElementWithClass("div", "condition", "symbol");
        let condionSpan = createElementWithClass("span", "condition");
        let forecatEl = createElementWithClass("span", "forecast-data");
        forecatEl.textContent = name;
        condionSpan.append(forecatEl);
        let { condition, high, low } = forecast;
        determineSymbol(symbolSpan, condition);
        forecatEl = createElementWithClass("span", "forecast-data");
        forecatEl.textContent = `${high}/${low}`;
        condionSpan.append(forecatEl);
        conditionsDiv.append(symbolSpan);
        conditionsDiv.append(condionSpan);
        currentForecastDiv.append(conditionsDiv);
      }

      function renderUpcomCondition(data) {
        let forecasts = Object.entries(data.forecast);
        let forecastInfo = createElementWithClass("div", "forecast-info");
        forecasts.forEach((f) => {
          let forecastInfo = f[1];
          const { condition, high, low } = forecastInfo;
          let upcoming = createElementWithClass("span", "upcoming");
          let forecatEl = createElementWithClass("span", "forecast-data");
          let symbol = createElementWithClass("span", "symbol");
          determineSymbol(symbol, condition);
          upcoming.append(symbol);
          forecatEl.textContent = `${high}/${low}`;
          upcoming.append(forecatEl);
          forecatEl = createElementWithClass("span", "forecast-data");
          forecatEl.textContent = condition;
          upcoming.append(forecatEl);
          upcomingForecastDiv.append(upcoming);
        });
      }

      function createElementWithClass(tag, ...classes) {
        let element = document.createElement(tag);
        element.classList.add(...classes);
        return element;
      }

      function determineSymbol(element, value) {
        switch (value) {
          case `Sunny`:
            element.innerHTML = weatherSymbols[0];
            break;
          case `Partly sunny`:
            element.innerHTML = weatherSymbols[1];
            break;
          case `Overcast`:
            element.innerHTML = weatherSymbols[2];
            break;
          case `Rain`:
            element.innerHTML = weatherSymbols[3];
            break;
          case `Degrees`:
            element.innerHTML = weatherSymbols[4];
            break;
        }
      }
    }
  });
}

attachEvents();
