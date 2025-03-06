(function($) {
    "use strict";
    $(document).ready(function() {
        $('.sub-menu').each(function() {
            $(this).parent().addClass('has-child').find('> a').append('<span class="arrow"></span>')
        });
        $('#menu-item-7791 > a, #menu-item-9658 > a').on('click', function(e) {
            e.preventDefault();
            $(this).parent().toggleClass('open').find('> .sub-menu').slideToggle('fast')
        });
        $('.mobile-menu').on('click', function() {
            $(this).parents('.main-menu').toggleClass('open')
        });
        $(document).on('click', function(e) {
            var $target = $(e.target);
            if (!$target.closest('.main-menu').length && $('.main-menu').hasClass('open')) {
                $('.main-menu').removeClass('open')
            }
        });
        $('.main-menu').on('click', function(e) {
            e.stopPropagation()
        });
        if (!$('body').hasClass('kingcomposer')) {
            $('body').addClass('not-kc')
        }
    })
})(jQuery);
document.addEventListener('DOMContentLoaded', function() {
    var translationIcon = document.getElementById('translation-icon');
    var languageSelector = document.getElementById('custom-language-selector');
    var options = document.querySelectorAll('.custom-option, .custom-popup-option');
    var savedLanguage = localStorage.getItem('preferredLanguage');
    var currentLang = document.documentElement.lang || 'en';
    if (savedLanguage) {
        updateTranslationIcon(savedLanguage)
    }
    if (savedLanguage && savedLanguage !== 'en' && savedLanguage !== 'fr') {
        applyTranslations(savedLanguage);
        highlightSelectedLanguage(savedLanguage)
    }

    function handleTranslationIconClick(event) {
        event.stopPropagation();
        if (languageSelector.style.display === 'block') {
            languageSelector.style.display = 'none'
        } else {
            languageSelector.style.display = 'block'
        }
    }
    translationIcon.addEventListener('click', handleTranslationIconClick);
    document.addEventListener('click', function(event) {
        if (languageSelector.style.display === 'block' && !languageSelector.contains(event.target) && event.target !== translationIcon) {
            languageSelector.style.display = 'none'
        }
    });
    options.forEach(function(option) {
        option.addEventListener('click', function(event) {
            event.stopPropagation();
            var langUrl = option.getAttribute('data-lang-url');
            var targetLanguage = option.getAttribute('data-lang');
            if (langUrl) {
                localStorage.removeItem('preferredLanguage');
                setTimeout(function() {
                    window.location.href = langUrl
                }, 100)
            } else if (targetLanguage) {
                localStorage.setItem('preferredLanguage', targetLanguage);
                applyTranslations(targetLanguage);
                highlightSelectedLanguage(targetLanguage);
                updateTranslationIcon(targetLanguage)
            }
            languageSelector.style.display = 'none'
        })
    });

    function highlightSelectedLanguage(targetLanguage) {
        options.forEach(function(option) {
            var lang = option.getAttribute('data-lang');
            if (lang === targetLanguage) {
                option.classList.add('selected')
            } else {
                option.classList.remove('selected')
            }
        })
    }

    function updateTranslationIcon(language) {
        var flagIcons = {
            'en': '#flag-uk',
            'fr': '#flag-fr',
            'es': '#flag-es',
            'de': '#flag-de',
            'it': '#flag-it',
            'pt': '#flag-pt',
            'zh-CN': '#flag-cn',
            'ja': '#flag-jp',
            'ar': '#flag-ar',
            'hi': '#flag-in',
            'ru': '#flag-ru',
            'ko': '#flag-kr',
            'tr': '#flag-tr',
            'vi': '#flag-vn',
            'bn': '#flag-bd',
            'id': '#flag-id',
            'th': '#flag-th',
            'nl': '#flag-nl',
            'pl': '#flag-pl',
            'ur': '#flag-pk',
            'sw': '#flag-tz',
            'fa': '#flag-ir',
            'uk': '#flag-ua',
            'el': '#flag-gr',
            'he': '#flag-il',
            'sv': '#flag-se',
            'no': '#flag-no',
            'da': '#flag-dk',
            'fi': '#flag-fi',
            'cs': '#flag-cz',
            'hu': '#flag-hu',
            'ms': '#flag-my',
            'tl': '#flag-ph',
            'zh-HK': '#flag-hk',
            'ta': '#flag-sg'
        };
        var svgIcon = flagIcons[language];
        if (svgIcon) {
            var newIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            newIcon.setAttribute('id', 'translation-icon');
            newIcon.setAttribute('width', '20');
            newIcon.setAttribute('height', '15');
            newIcon.setAttribute('viewBox', '0 0 20 15');
            newIcon.setAttribute('class', 'translang');
            newIcon.innerHTML = '<use xlink:href="' + svgIcon + '"></use>';
            translationIcon.replaceWith(newIcon);
            translationIcon = newIcon;
            translationIcon.addEventListener('click', handleTranslationIconClick)
        }
    }

    function applyTranslations(targetLanguage) {
        var elementsToTranslate = document.querySelectorAll('[data-title], [data-tooltip]');
        elementsToTranslate.forEach(function(element) {
            var text;
            if (element.hasAttribute('data-title')) {
                text = element.getAttribute('data-title');
                translateText(text, targetLanguage, function(translatedText) {
                    element.innerText = translatedText
                })
            }
            if (element.hasAttribute('data-tooltip')) {
                text = element.getAttribute('data-tooltip');
                translateText(text, targetLanguage, function(translatedText) {
                    element.setAttribute('data-tooltip', translatedText);
                    var tooltipElement = document.querySelector('.hourly-custom-tooltip');
                    if (tooltipElement && tooltipElement.closest('.hourly-tooltip') === element) {
                        tooltipElement.innerText = translatedText
                    }
                })
            }
        })
    }

    function translateText(text, targetLanguage, callback) {
        var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + currentLang + '&tl=' + targetLanguage + '&dt=t&q=' + encodeURIComponent(text);
        fetch(url).then(response => response.json()).then(data => {
            if (data && data[0] && data[0][0] && typeof data[0][0][0] === 'string') {
                var translatedText = data[0][0][0];
                callback(translatedText)
            } else {
                console.error('Translation error:', data);
                callback(text)
            }
        }).catch(error => {
            console.error('Error:', error);
            callback(text)
        })
    }
});
document.addEventListener('DOMContentLoaded', function() {
    var moreLanguagesBtn = document.getElementById('more-languages-btn');
    var moreLanguagesPopup = document.getElementById('more-languages-popup');
    var closePopup = document.querySelector('.close-popup');
    moreLanguagesBtn.addEventListener('click', function() {
        moreLanguagesPopup.style.display = 'block'
    });
    closePopup.addEventListener('click', function() {
        moreLanguagesPopup.style.display = 'none'
    });
    window.addEventListener('click', function(event) {
        if (event.target === moreLanguagesPopup) {
            moreLanguagesPopup.style.display = 'none'
        }
    })
});