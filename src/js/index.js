const initSwiper = (classNames) => {
    classNames.forEach((className) => {
        new Swiper(className, {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            loop: true,
            slidesPerView: 3,
            coverflowEffect: {
              rotate: -50,
              scale: 0.9,
              depth: 150,
              modifier: 1,
              slideShadows: false,
            },
        });
    })
};

initSwiper(['.currency-slider--first', '.currency-slider--second']);

const nextWidget = () => {
    $('.active').addClass('slideOutUpAnimation');
    const nextWidget = $('.active').next().length ? $('.active').next() : $('.active').prev();
    setTimeout(() => {
        $('.active').removeClass('active slideOutUpAnimation');
        nextWidget.addClass('active slideInDownAnimation');
        setTimeout(() => {
            $('.active').removeClass('slideInDownAnimation');
        }, 1000);
    }, 800);
}

const prevWidget = () => {
    $('.active').addClass('slideOutDownAnimation');
    const prevWidget = $('.active').prev().length ? $('.active').prev() : $('.active').next();
    setTimeout(() => {
        $('.active').removeClass('active slideOutDownAnimation');
        prevWidget.addClass('active slideInUpAnimation');
        setTimeout(() => {
            $('.active').removeClass('slideInUpAnimation');
        }, 1000);
    }, 800);
}

const getRates = async (curr1, curr2) => {
    const [rate1, rate2] = await Promise.all([requestRate(curr1, curr2), requestRate(curr2, curr1)]);
    return [rate1.rates[curr2], rate2.rates[curr1]];
};

const requestRate = async (baseCurr, rateCurr) => {
    return await $.getJSON(`https://api.exchangerate.host/latest/?base=${baseCurr}`,
    function (response) {
       return response.rates[rateCurr];
    }
    );
};

const getCurrencyText = (baseCurr, rateCurr, rate) => {
    return `1 ${baseCurr} = ${rate} ${rateCurr}`;
};

const toggleContainers = (containerToHide, containerToShow) => {
    containerToHide.animate({opacity: 'hide'}, 400, () => {
        $(this).hide();
    });
    setTimeout(() => {
        containerToShow.css({ 'display': 'flex', 'opacity': 0 }).animate({opacity: '1'}, 400);
    }, 400)
};

const setRates = (className, currency1, currency2, rate) => {
    $(className).text(getCurrencyText(currency1, currency2, rate));
};

const checkBtnClickHandler = async () => {
    const currency1 = $('.currency-slider--first .swiper-slide-active').data('currency');
    const currency2 = $('.currency-slider--second .swiper-slide-active').data('currency');
    const [rate1, rate2] = await getRates(currency1, currency2);
    setRates('.rates__rate--first', currency1, currency2, rate1);
    setRates('.rates__rate--second', currency2, currency1, rate2);
    toggleContainers($('.select-currency'), $('.rates'));
};

const resetCurrency = () => {
    toggleContainers($('.rates'), $('.select-currency'));
    setTimeout(() => {
        $('.rates__rate').text('');
    }, 500)
};

const errorCallback = (error) => {
    console.log(error);
};

const setCity = (timezone) => {
    const city = timezone.split('/')[1];
    $('.weather__city').text(`${city}`);
}

const setTemp = (temp) => {
    $('.weather__temp').html(`${temp}&#176C`);
}

const setFeelsLikeConditions = (temp) => {
    $('.weather__text--feels-like').html(`Feels like: ${temp}&#176C`);
}

const setConditions = (text) => {
    $('.weather__text--conditions').text(`${text}`);
}

const setHumidity = (humidity) => {
    $('.weather__text--humidity').text(`Humidity: ${humidity}%`);
}

const renderWeatherHTML = (weather) => {
    setCity(weather.timezone);
    setTemp(weather.currentConditions.temp)
    setFeelsLikeConditions(weather.currentConditions.feelslike);
    setConditions(weather.currentConditions.conditions);
    setHumidity(weather.currentConditions.humidity);
}
  
const getGeolocation = async () => {
    navigator.geolocation.getCurrentPosition((position) => {
        getCurrentWeather(position.coords.latitude, position.coords.longitude)
    }, errorCallback);
   
}
const getCurrentWeather = async (latitude, longitude) => {
    const weather = await $.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude}%2C%20${longitude}?unitGroup=metric&include=current&key=8H4G9NNFMS2Q77D8VKL5YG6QG&contentType=json`);
    renderWeatherHTML(weather);
}

getGeolocation();

$('.widgets-nav-button--prev').click(nextWidget);
$('.widgets-nav-button--next').click(prevWidget);
$('.select-currency__check-button').click(checkBtnClickHandler);
$('.rates__reset-btn').click(resetCurrency);