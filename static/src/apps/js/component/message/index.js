'use strict';
Object.defineProperty(exports, "__esModule", {
    value: true
});
import React from 'react';
import './style/index.less';
import './icon/iconfont';

let key = 1;
let messageInstance = 0;
const className = 'myCat-message';
import message from './message';

function outerFrame(callback) {
    if (messageInstance === 0) {
        const div = document.createElement('div');
        div.id = className;
        document.body.appendChild(div);
        message.newMessage(className, function (instance) {
            callback(instance);
            messageInstance = instance;
        })
    } else {
        callback(messageInstance);
    }

}

function node(content) {
    let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
    let type = arguments[2];
    let onClose = arguments[3];

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
    key++;

    let closePromise = new Promise(function (resolve) {
        let callback = function callback() {
            if (typeof onClose === 'function') {
                onClose();
            }

            return resolve(true);
        };
        outerFrame(function (instance) {
                instance.notice({
                    key: key,
                    duration: duration,
                    style: {},
                    content: React.createElement(
                        'div',
                        {className: 'message-node-content'},
                        React.createElement(
                            'svg',
                            {className: `icon message-icon ${iconClass}`},
                            React.createElement(
                                'use', {xlinkHref: iconType}
                            ),
                        ),
                        React.createElement(
                            'span',
                            null,
                            content
                        )
                    ),
                    onClose: callback
                })
            }
        );
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

const app = {
    info: function info(content, duration, onClose) {
        return node(content, duration, 'info', onClose);
    },
    success: function success(content, duration, onClose) {
        return node(content, duration, 'success', onClose);
    },
    error: function error(content, duration, onClose) {
        return node(content, duration, 'error', onClose);
    },
    warn: function warn(content, duration, onClose) {
        return node(content, duration, 'warning', onClose);
    },
    warning: function warning(content, duration, onClose) {
        return node(content, duration, 'warning', onClose);
    },
};
module.exports.message = app;