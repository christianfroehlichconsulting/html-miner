'use strict';

const cheerio = require('cheerio');
const _ = require('lodash');

const isString = s => typeof s === 'string';
const isArrayLike = a => typeof a.length === 'number';
const isObjectLike = o => o !== null && typeof o === 'object';
const isFunction = f => typeof f === 'function';

const validateSelector = selector => {
    if (
        !isString(selector) &&
        !isArrayLike(selector) &&
        !isObjectLike(selector) &&
        !isFunction(selector)) {
        throw new Error('"selector" must be string, array, object or function');
    }
};

const validateHtml = html => {

    // 'html' is undefined
    if (html === undefined || html === null) {
        return false;
    }

    // html must be string or cheerio
    if (!isString(html) && !html.type) {
        return false;
    }

    return true;
};

var fetchSpecialKeys = ($, selector, memo) => {
    var _specialKeys = {

        _each_: ($, specialKeySelector, selector, memo) => {

            var elements, element, $specialKeySelector = $(specialKeySelector);

            if ($specialKeySelector.length === 0) {
                return [];
            }

            $specialKeySelector.each(function (i, el) {
                element = htmlMiner(el, selector, {
                    $document: memo.$document,
                    globalData: memo.globalData,
                    manipulator: '_each_'
                });

                // remove empty objects.
                if (!_.isEmpty(element)) {
                    if (element._eachId_) { // if _eachId_ is specified, use it as object ID
                        elements = elements || {};
                        elements[element._eachId_] = element;
                        delete element['_eachId_'];
                    } else {
                        elements = elements || [];
                        elements.push(element);
                    }
                }
            });
            return elements;

        },

        _container_: ($, specialKeySelector, selector, memo) => {

            return htmlMiner($(specialKeySelector).get(0), selector, {
                $document: memo.$document,
                globalData: memo.globalData,
                manipulator: '_container_'
            });

        }

    };

    var elements;
    Object.entries(_specialKeys).forEach(([key, callback]) => {
        if (selector[key] !== undefined) {
            var specialKeySelector = selector[key];

            // selector must be string or function
            if (!isString(specialKeySelector) && !isFunction(specialKeySelector)) {
                throw new Error('"selector" of a special key must be string or function');
            }

            // special key - selector could be a complex function
            if (isFunction(specialKeySelector)) {
                specialKeySelector = specialKeySelector.apply(this, [{
                    $: memo.$document,
                    $scope: (memo.manipulator !== undefined) ? $.root().children() : $.root(),
                    globalData: memo.globalData,
                    scopeData: {}
                }]);
            }

            var _selector = _.cloneDeepWith(selector);
            delete _selector[key];

            elements = callback($, specialKeySelector, _selector, memo);
        }
    });

    return elements;
};

const fetchSelector = (html, selector, memo, $, scopeData) => {

    let elements = [];

    switch (true) {

        case isObjectLike(selector):
            elements.push(htmlMiner(html, selector, {
                $document: memo.$document,
                globalData: memo.globalData
            }));
            break;

        case isFunction(selector):
            elements.push(selector.apply(this, [{
                $: memo.$document,
                $scope: (memo.manipulator !== undefined) ? $.root().children() : $.root(),
                globalData: memo.globalData,
                scopeData: scopeData
            }]));
            break;

        case isString(selector):
            $(selector).each(function (i, el) {
                elements.push(_.trim($(el).text()));
            });
            break;

    }

    return elements;

};

const htmlMiner = (html, originalSelector, memo) => {

    if (validateHtml(html) === false) {
        return undefined;
    }

    validateSelector(originalSelector);

    const $document = cheerio.load(html);
    const selector = isObjectLike(originalSelector) ? originalSelector : { _default_: originalSelector };
    const scopeData = isArrayLike(originalSelector) ? [] : {};

    memo = memo || {
        $document,
        globalData: scopeData,
        manipulator: undefined
    };

    let elements = fetchSpecialKeys($document, selector, memo);
    if (elements !== undefined) {
        return elements;
    }

    Object.entries(selector).forEach(([selectorKey, selectorValue]) => {
        elements = fetchSelector(html, selectorValue, memo, $document, scopeData);

        // remove 'undefined' values
        elements = elements.filter(o => o !== undefined);

        if (elements.length >= 1) {
            scopeData[selectorKey] = elements.length > 1 ? elements : elements[0];
        }
    });

    return isObjectLike(originalSelector) ? scopeData : scopeData._default_;
};

module.exports = (html, selector) => htmlMiner(html, selector);
