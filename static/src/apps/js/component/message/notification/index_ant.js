"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = void 0;
import '../style/index.less';
import './icon/index';
let React = _interopRequireWildcard(require("react"));

let _rcNotification = _interopRequireDefault(require("./notification/notification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { let newObj = {}; if (obj != null) { for (let key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { let desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

/* global Promise */
let defaultDuration = 3;
let defaultTop;
let messageInstance;
let key = 1;
let prefixCls = 'myCat-message';
let transitionName = 'move-up';
let getContainer;
let maxCount;

function getMessageInstance(callback) {
    if (messageInstance) {
        callback(messageInstance);
        return;
    }

    _rcNotification["default"].newInstance({
        prefixCls: prefixCls,
        transitionName: transitionName,
        style: {
            top: defaultTop
        },
        getContainer: getContainer,
        maxCount: maxCount
    }, function (instance) {
        if (messageInstance) {
            callback(messageInstance);
            return;
        }

        messageInstance = instance;
        callback(instance);
    });
}

function notice(args) {
    let duration = args.duration !== undefined ? args.duration : defaultDuration;
    let type = args.type;
    let iconType = {
        info: '#icon-info',
        success: '#icon-chenggong1',
        error: '#icon-error',
        warning: '#icon-warning',
    }[type];
    let iconClass = {
        info: 'icon-info',
        success: 'icon-success',
        error: 'icon-error',
        warning: 'icon-warning',
    }[type];
    let target = key++;
    let closePromise = new Promise(function (resolve) {
        let callback = function callback() {
            if (typeof args.onClose === 'function') {
                args.onClose();
            }

            return resolve(true);
        };

        getMessageInstance(function (instance) {

            instance.notice({
                key: target,
                duration: duration,
                style: {},
                content: React.createElement("div", {
                    className: "".concat(prefixCls, "-custom-content").concat(args.type ? " ".concat(prefixCls, "-").concat(args.type) : '')
                },
                        React.createElement(
                            'svg',
                            { className:`icon message-icon ${iconClass}`},
                            React.createElement(
                                'use', {xlinkHref:iconType}
                            ),
                        ),
                        React.createElement(
                            'span',
                            null,
                            args.content
                        )),
                onClose: callback
            });
        });
    });

    let result = function result() {
        if (messageInstance) {
            messageInstance.removeNotice(target);
        }
    };

    result.then = function (filled, rejected) {
        return closePromise.then(filled, rejected);
    };

    result.promise = closePromise;
    return result;
}

let api = {
    open: notice,
    config: function config(options) {
        if (options.top !== undefined) {
            defaultTop = options.top;
            messageInstance = null; // delete messageInstance for new defaultTop
        }

        if (options.duration !== undefined) {
            defaultDuration = options.duration;
        }

        if (options.prefixCls !== undefined) {
            prefixCls = options.prefixCls;
        }

        if (options.getContainer !== undefined) {
            getContainer = options.getContainer;
        }

        if (options.transitionName !== undefined) {
            transitionName = options.transitionName;
            messageInstance = null; // delete messageInstance for new transitionName
        }

        if (options.maxCount !== undefined) {
            maxCount = options.maxCount;
            messageInstance = null;
        }
    },
    destroy: function destroy() {
        if (messageInstance) {
            messageInstance.destroy();
            messageInstance = null;
        }
    }
};
['success', 'info', 'warning', 'error', 'loading'].forEach(function (type) {
    api[type] = function (content, duration, onClose) {
        if (typeof duration === 'function') {
            onClose = duration;
            duration = undefined;
        }

        return api.open({
            content: content,
            duration: duration,
            type: type,
            onClose: onClose
        });
    };
});
api.warn = api.warning;

module.exports.message =api;