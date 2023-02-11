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

initSwiper(['.swiper1', '.swiper2']);

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

const toggleCurrencyWrappers = (containerToHide, containerToShow) => {
    containerToHide.animate({opacity: 'hide'}, 400, () => {
        $(this).hide();
    });
    setTimeout(() => {
        containerToShow.css({ 'display': 'flex', 'opacity': 0 }).animate({opacity: '1'}, 400);
    }, 400)
};

const setRates = async () => {
    const currency1 = $('.swiper1 .swiper-slide-active').data('currency');
    const currency2 = $('.swiper2 .swiper-slide-active').data('currency');
    const [rate1, rate2] = await getRates(currency1, currency2);
    $('.currency-rate__rate--1').text(getCurrencyText(currency1, currency2, rate1));
    $('.currency-rate__rate--2').text(getCurrencyText(currency2, currency1, rate2));
};

const checkBtnClickHandler = () => {
    setRates();
    toggleCurrencyWrappers($('.currency-rate__select-wrapper'), $('.currency-rate__rates-wrapper'));
};

const resetCurrency = () => {
    toggleCurrencyWrappers($('.currency-rate__rates-wrapper'), $('.currency-rate__select-wrapper'));
    setTimeout(() => {
        $('.currency-rate__rate').text('');
    }, 500)
};

$('.currency-rate__check-button').click(checkBtnClickHandler);
$('.currency-rate__reset-btn').click(resetCurrency);